from django.db import connection, transaction
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .models import Course, Lesson
from .serializers import CourseSerializer

logger = logging.getLogger(__name__)


def _table_columns(table_name: str) -> set[str]:
    with connection.cursor() as cursor:
        cols = [
            col.name
            for col in connection.introspection.get_table_description(cursor, table_name)
        ]
    return set(cols)


def _build_my_schedule_payload(student_id: int) -> list[dict]:
    """
    Support multiple real DB layouts for schedules_schedule:
    - course-based rows: (student_id, course_id, day_of_week, start_time, end_time)
    - lesson-based rows: (student_id, lesson_id) + schedules_lesson + schedules_course
    """
    schedule_cols = _table_columns("schedules_schedule")

    if {"student_id", "course_id", "day_of_week", "start_time", "end_time"}.issubset(
        schedule_cols
    ):
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.id, s.course_id, s.day_of_week, s.start_time, s.end_time, c.name, c.code
                FROM schedules_schedule s
                JOIN schedules_course c ON c.id = s.course_id
                WHERE s.student_id = %s
                ORDER BY s.day_of_week, s.start_time
                """,
                [student_id],
            )
            rows = cursor.fetchall()

        data: list[dict] = []
        for row in rows:
            schedule_id, course_id, day_of_week, start_time, end_time, course_name, course_code = row
            data.append(
                {
                    "id": schedule_id,
                    "lesson": course_id,
                    "lesson_details": {
                        "id": course_id,
                        "lesson_type": "lecture",
                        "lesson_type_display": "Lecture",
                        "lecturer": "",
                        "room": "",
                        "day_of_week": day_of_week,
                        "day_display": "",
                        "start_time": str(start_time),
                        "end_time": str(end_time),
                        "course_name": course_name,
                        "course_code": course_code,
                    },
                }
            )
        return data

    if {"student_id", "lesson_id"}.issubset(schedule_cols):
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.id, l.id, l.lesson_type, l.lecturer, l.room,
                       l.day_of_week, l.start_time, l.end_time, c.name, c.code
                FROM schedules_schedule s
                JOIN schedules_lesson l ON l.id = s.lesson_id
                JOIN schedules_course c ON c.id = l.course_id
                WHERE s.student_id = %s
                ORDER BY l.day_of_week, l.start_time
                """,
                [student_id],
            )
            rows = cursor.fetchall()

        lesson_type_map = {
            "lecture": "Lecture",
            "practice": "Practice",
            "lab": "Laboratory",
        }

        data = []
        for row in rows:
            (
                schedule_id,
                lesson_id,
                lesson_type,
                lecturer,
                room,
                day_of_week,
                start_time,
                end_time,
                course_name,
                course_code,
            ) = row
            data.append(
                {
                    "id": schedule_id,
                    "lesson": lesson_id,
                    "lesson_details": {
                        "id": lesson_id,
                        "lesson_type": lesson_type,
                        "lesson_type_display": lesson_type_map.get(lesson_type, lesson_type),
                        "lecturer": lecturer,
                        "room": room,
                        "day_of_week": day_of_week,
                        "day_display": "",
                        "start_time": str(start_time),
                        "end_time": str(end_time),
                        "course_name": course_name,
                        "course_code": course_code,
                    },
                }
            )
        return data

    raise RuntimeError(
        f"Unsupported schedules_schedule schema. Columns: {sorted(schedule_cols)}"
    )

class RegisterForCoursesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        lesson_ids = request.data.get('lessons', [])
        user = request.user

        if not lesson_ids:
            return Response(
                {'error': 'No lessons selected'},
                status=status.HTTP_400_BAD_REQUEST
            )

        lessons = Lesson.objects.filter(id__in=lesson_ids)
        if not lessons.exists():
            return Response(
                {'error': 'Selected lessons were not found'},
                status=status.HTTP_400_BAD_REQUEST
            )

        schedule_cols = _table_columns("schedules_schedule")

        # Insert into schedules_schedule using the actual DB schema.
        with transaction.atomic():
            with connection.cursor() as cursor:
                for lesson in lessons:
                    if {"student_id", "course_id", "day_of_week", "start_time", "end_time"}.issubset(
                        schedule_cols
                    ):
                        cursor.execute(
                            """
                            SELECT 1
                            FROM schedules_schedule
                            WHERE student_id = %s
                              AND course_id = %s
                              AND day_of_week = %s
                              AND start_time = %s
                              AND end_time = %s
                            LIMIT 1
                            """,
                            [
                                user.id,
                                lesson.course_id,
                                lesson.day_of_week,
                                lesson.start_time,
                                lesson.end_time,
                            ],
                        )
                        already_exists = cursor.fetchone() is not None
                        if not already_exists:
                            cursor.execute(
                                """
                                INSERT INTO schedules_schedule (student_id, course_id, day_of_week, start_time, end_time)
                                VALUES (%s, %s, %s, %s, %s)
                                """,
                                [
                                    user.id,
                                    lesson.course_id,
                                    lesson.day_of_week,
                                    lesson.start_time,
                                    lesson.end_time,
                                ],
                            )
                    elif {"student_id", "lesson_id"}.issubset(schedule_cols):
                        cursor.execute(
                            """
                            SELECT 1
                            FROM schedules_schedule
                            WHERE student_id = %s AND lesson_id = %s
                            LIMIT 1
                            """,
                            [user.id, lesson.id],
                        )
                        already_exists = cursor.fetchone() is not None
                        if not already_exists:
                            cursor.execute(
                                """
                                INSERT INTO schedules_schedule (student_id, lesson_id)
                                VALUES (%s, %s)
                                """,
                                [user.id, lesson.id],
                            )
                    else:
                        return Response(
                            {
                                "error": "Unsupported schedules_schedule schema",
                                "columns": sorted(schedule_cols),
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
        
        return Response({'message': 'Registered successfully'}, status=status.HTTP_200_OK)
    
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

class StudentScheduleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            payload = _build_my_schedule_payload(request.user.id)
        except Exception:
            logger.exception("Failed to build my-schedule payload")
            return Response(
                {"detail": "Failed to load schedule (server error)."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(payload, status=status.HTTP_200_OK)
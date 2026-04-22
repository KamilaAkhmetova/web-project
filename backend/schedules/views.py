from django.db import connection, transaction
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Lesson
from .serializers import CourseSerializer

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

        # Insert into schedules_schedule using the actual DB schema.
        with transaction.atomic():
            with connection.cursor() as cursor:
                for lesson in lessons:
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
        
        return Response({'message': 'Registered successfully'}, status=status.HTTP_200_OK)
    
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

class StudentScheduleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.id, s.course_id, s.day_of_week, s.start_time, s.end_time, c.name, c.code
                FROM schedules_schedule s
                JOIN schedules_course c ON c.id = s.course_id
                WHERE s.student_id = %s
                ORDER BY s.day_of_week, s.start_time
                """,
                [request.user.id],
            )
            rows = cursor.fetchall()

        data = []
        for row in rows:
            schedule_id, course_id, day_of_week, start_time, end_time, course_name, course_code = row
            data.append({
                'id': schedule_id,
                'lesson': course_id,
                'lesson_details': {
                    'id': course_id,
                    'lesson_type': 'lecture',
                    'lesson_type_display': 'Lecture',
                    'lecturer': '',
                    'room': '',
                    'day_of_week': day_of_week,
                    'day_display': '',
                    'start_time': str(start_time),
                    'end_time': str(end_time),
                    'course_name': course_name,
                    'course_code': course_code,
                }
            })

        return Response(data, status=status.HTTP_200_OK)
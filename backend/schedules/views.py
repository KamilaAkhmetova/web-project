# from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Schedule, Lesson
from .serializers import CourseSerializer, ScheduleSerializer

class RegisterForCoursesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        lesson_ids = request.data.get('lessons', [])
        user = request.user
        
        # Создаём записи в расписании
        for lesson_id in lesson_ids:
            Schedule.objects.get_or_create(
                student=user,
                lesson_id=lesson_id
            )
        
        return Response({'message': 'Registered successfully'}, status=status.HTTP_200_OK)
    
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

class StudentScheduleView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Schedule.objects.filter(student=self.request.user)
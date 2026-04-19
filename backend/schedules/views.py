from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Course, Schedule
from .serializers import CourseSerializer, ScheduleSerializer

class CourseListView(generics.ListAPIView):
    """Список всех курсов"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

class StudentScheduleView(generics.ListAPIView):
    """Расписание текущего студента"""
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Schedule.objects.filter(student=self.request.user)
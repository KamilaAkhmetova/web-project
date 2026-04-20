from rest_framework import serializers
from .models import Course, Schedule, Lesson

class LessonSerializer(serializers.ModelSerializer):
    lesson_type_display = serializers.CharField(source='get_lesson_type_display', read_only=True)
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'lesson_type', 'lesson_type_display', 'lecturer', 'room',
                  'day_of_week', 'day_display', 'start_time', 'end_time']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)    
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'credits', 'description', 'lessons']


class ScheduleSerializer(serializers.ModelSerializer):
    lesson_details = LessonSerializer(source='lesson', read_only=True)
    
    class Meta:
        model = Schedule
        fields = ['id', 'lesson', 'lesson_details']
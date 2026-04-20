from django.contrib import admin
from .models import Course, Lesson, Schedule

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'credits')
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('course', 'lesson_type', 'lecturer', 'day_of_week', 'start_time')
    list_filter = ('lesson_type', 'day_of_week')

@admin.register(Schedule)
class StudentScheduleAdmin(admin.ModelAdmin):
    list_display = ('student', 'lesson')
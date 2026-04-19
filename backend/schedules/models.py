from django.db import models
from django.conf import settings  

class Course(models.Model):
    LESSON_TYPES = [
        ('lecture', 'Lecture'),
        ('practice', 'Practice'),
        ('lab', 'Laboratory'),
    ]
    
    name = models.CharField(max_length=200, verbose_name="Name")
    code = models.CharField(max_length=20, verbose_name="Course code", unique=True)
    credits = models.IntegerField(verbose_name="Credits")
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES, verbose_name="Lesson type")
    lecturer = models.CharField(max_length=100, verbose_name="Lecturer")
    room = models.CharField(max_length=50, verbose_name="Room")
    description = models.TextField(blank=True, verbose_name="Description")
    
    def __str__(self):
        return f"{self.code}: {self.name}"
    
    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"


class Schedule(models.Model):
    """Student schedule"""
    DAYS_OF_WEEK = [
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
        (7, 'Sunday'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='schedule')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    class Meta:
        unique_together = ['student', 'course', 'day_of_week', 'start_time']
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.student.username} - {self.course.name} ({self.get_day_of_week_display()})"
from django.db import models
from django.conf import settings  

class Course(models.Model):
   
    name = models.CharField(max_length=200, verbose_name="Name")
    code = models.CharField(max_length=20, verbose_name="Course code", unique=True)
    credits = models.IntegerField(verbose_name="Credits")
    
    description = models.TextField(blank=True, verbose_name="Description")
    
    def __str__(self):
        return f"{self.code}: {self.name}"
    
    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"

class Lesson(models.Model):
    LESSON_TYPES = [
        ('lecture', 'Lecture'),
        ('practice', 'Practice'),
        ('lab', 'Laboratory'),
    ]
    
    DAYS_OF_WEEK = [
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
        (7, 'Sunday'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES, verbose_name="Lesson type")
    lecturer = models.CharField(max_length=100, verbose_name="Lecturer")
    room = models.CharField(max_length=50, verbose_name="Room")
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK, verbose_name="Day of week")
    start_time = models.TimeField(verbose_name="Start time")
    end_time = models.TimeField(verbose_name="End time")
    
    def __str__(self):
        return f"{self.course.code} - {self.get_lesson_type_display()} ({self.get_day_of_week_display()})"
    
    class Meta:
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"
        ordering = ['day_of_week', 'start_time']

class Schedule(models.Model):
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='schedule')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['student', 'lesson']
    
    def __str__(self):
        return f"{self.student.username} - {self.lesson}"
    
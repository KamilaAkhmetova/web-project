from django.urls import path
from .views import CourseListView, StudentScheduleView
from .views import RegisterForCoursesView

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='courses'),
    path('my-schedule/', StudentScheduleView.as_view(), name='my-schedule'),
    path('register/', RegisterForCoursesView.as_view(), name='register'),
]
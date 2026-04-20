from django.urls import path
from .views import CourseListView, StudentScheduleView

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='courses'),
    path('my-schedule/', StudentScheduleView.as_view(), name='my-schedule'),
]
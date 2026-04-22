from django.urls import path
from .views import RegisterView, login_view, logout_view, profile_view, check_auth_view, refresh_token_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('check-auth/', check_auth_view, name='check_auth'),
    path('refresh/', refresh_token_view, name='refresh'),
]
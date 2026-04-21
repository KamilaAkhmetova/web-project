from django.urls import path
from . import views

urlpatterns = [
    # CBV
    path('api/buffets/', views.BuffetListAPIView.as_view(), name='buffet-list'),
    path('api/foods/<int:pk>/', views.FoodDetailAPIView.as_view(), name='food-detail'),
    path('api/foods/', views.FoodCreateAPIView.as_view(), name='food-create'),  # ← ДОБАВИТЬ ЭТУ СТРОЧКУ
    
    # FBV
    path('api/buffets/<int:buffet_id>/detail/', views.buffet_detail_view, name='buffet-detail'),
    path('api/foods/search/', views.search_foods_view, name='search-foods'),
]
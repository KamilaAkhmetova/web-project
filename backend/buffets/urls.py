from django.urls import path
from . import views

urlpatterns = [
    path('buffets/', views.BuffetListAPIView.as_view(), name='buffet-list-create'),
    path('buffets/<int:buffet_id>/detail/', views.buffet_detail_view, name='buffet-detail'),
    path('foods/', views.FoodListCreateAPIView.as_view(), name='food-list-create'),
    path('foods/<int:pk>/', views.FoodDetailAPIView.as_view(), name='food-detail'),
    path('foods/search/', views.search_foods_view, name='search-foods'),
    path('opening-hours/', views.OpeningHoursListCreateAPIView.as_view(), name='opening-hours-list-create'),
    path('opening-hours/<int:pk>/', views.OpeningHoursDetailAPIView.as_view(), name='opening-hours-detail'),
]

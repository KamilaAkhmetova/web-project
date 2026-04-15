from django.urls import path
from . import views

urlpatterns = [
    # CBV
    path('buffets/', views.BuffetListAPIView.as_view(), name='buffet-list'),
    path('foods/<int:pk>/', views.FoodDetailAPIView.as_view(), name='food-detail'),
    
    # FBV
    path('buffets/<int:buffet_id>/detail/', views.buffet_detail_view, name='buffet-detail'),
    path('foods/search/', views.search_foods_view, name='search-foods'),
]
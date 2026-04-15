from django.contrib import admin
from .models import Buffet, OpeningHours, Food

class OpeningHoursInline(admin.TabularInline):
    model = OpeningHours
    extra = 7

class FoodInline(admin.TabularInline):
    model = Food
    extra = 1

@admin.register(Buffet)
class BuffetAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'is_temporarily_closed', 'status']
    list_filter = ['is_temporarily_closed']
    search_fields = ['name']
    inlines = [OpeningHoursInline, FoodInline]

@admin.register(OpeningHours)
class OpeningHoursAdmin(admin.ModelAdmin):
    list_display = ['buffet', 'get_day_display', 'open_time', 'close_time', 'is_closed']
    list_filter = ['buffet', 'day', 'is_closed']

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ['name', 'buffet', 'price_student', 'is_available']
    list_filter = ['buffet', 'is_available', 'category']
    search_fields = ['name', 'description']
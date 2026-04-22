from rest_framework import serializers
from .models import Buffet, OpeningHours, Food

class BuffetListSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    
    class Meta:
        model = Buffet
        fields = ['id', 'name', 'address', 'is_temporarily_closed', 'status', 'image_url']

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'buffet', 'name', 'description', 'price_student', 
                  'price_employee', 'price_guest', 'category', 'is_available']
        read_only_fields = ['id']

class OpeningHoursSerializer(serializers.Serializer):
    day = serializers.CharField(source='get_day_display')
    hours = serializers.SerializerMethodField()
    
    def get_hours(self, obj):
        if obj.is_closed:
            return "Closed"
        return f"{obj.open_time.strftime('%H:%M')} - {obj.close_time.strftime('%H:%M')}"

class OpeningHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningHours
        fields = ['id', 'buffet', 'day', 'open_time', 'close_time', 'is_closed']
        
class BuffetDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    address = serializers.CharField()
    status = serializers.CharField()
    is_temporarily_closed = serializers.BooleanField()
    image_url = serializers.CharField(allow_null=True)
    hours = serializers.SerializerMethodField()
    foods = serializers.SerializerMethodField()
    
    def get_hours(self, obj):
        hours = obj.hours.all()
        return OpeningHoursSerializer(hours, many=True).data
    
    def get_foods(self, obj):
        foods = obj.foods.filter(is_available=True)
        return FoodSerializer(foods, many=True).data
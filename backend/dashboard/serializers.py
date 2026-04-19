from rest_framework import serializers
from .models import News

class NewsSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'date', 'formatted_date', 'preview']
    def get_formatted_date(self, obj):
        return obj.date.strftime('%d.%m.%Y')
    
    def get_preview(self, obj):
        if len(obj.content) > 150:
            return obj.content[:150] + '...'
        return obj.content
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import Buffet, Food
from .serializers import BuffetListSerializer, BuffetDetailSerializer, FoodSerializer

# ========== CBV ДЛЯ BUFFETS ==========

class BuffetListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        buffets = Buffet.objects.all()
        serializer = BuffetListSerializer(buffets, many=True)
        return Response({
            'success': True,
            'count': len(serializer.data),
            'data': serializer.data
        })
    
    def post(self, request):
        """Создать новый буфет"""
        serializer = BuffetListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ========== CBV ДЛЯ FOODS (FULL CRUD) ==========

class FoodListCreateAPIView(APIView):
    """GET - список всех блюд, POST - создать новое блюдо"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        foods = Food.objects.all()
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FoodDetailAPIView(APIView):
    """GET, PUT, DELETE для одного блюда"""
    permission_classes = [AllowAny]
    
    def get_object(self, pk):
        return get_object_or_404(Food, pk=pk)
    
    def get(self, request, pk):
        food = self.get_object(pk)
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    
    def put(self, request, pk):
        food = self.get_object(pk)
        serializer = FoodSerializer(food, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        food = self.get_object(pk)
        food.delete()
        return Response({'message': 'Food deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# ========== FBV ==========

@api_view(['GET'])
def buffet_detail_view(request, buffet_id):
    buffet = get_object_or_404(Buffet, id=buffet_id)
    serializer = BuffetDetailSerializer(buffet)
    return Response({
        'success': True,
        'data': serializer.data
    })


@api_view(['GET'])
def search_foods_view(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response({'data': []})
    
    foods = Food.objects.filter(name__icontains=query)[:20]
    serializer = FoodSerializer(foods, many=True)
    return Response({'data': serializer.data})
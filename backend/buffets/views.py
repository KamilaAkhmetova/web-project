from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import Buffet, Food
from .serializers import BuffetListSerializer, BuffetDetailSerializer, FoodSerializer

# ========== CLASS-BASED VIEWS (2 штуки) ==========

# CBV #1: List all buffets
class BuffetListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        buffets = Buffet.objects.with_food_count()
        serializer = BuffetListSerializer(buffets, many=True)
        return Response({
            'success': True,
            'count': len(serializer.data),
            'data': serializer.data
        })

# CBV #2: Food detail (CRUD for Food)
class FoodDetailAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        food = get_object_or_404(Food, pk=pk)
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    
class FoodCreateAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Проверяем, что buffet_id передан
        buffet_id = request.data.get('buffet')
        if not buffet_id:
            return Response(
                {'error': 'buffet field is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Проверяем, что буфет существует
        try:
            buffet = Buffet.objects.get(id=buffet_id)
        except Buffet.DoesNotExist:
            return Response(
                {'error': 'Buffet not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ========== FUNCTION-BASED VIEWS (2 штуки) ==========

# FBV #1: Get buffet details with hours and menu
@api_view(['GET'])
def buffet_detail_view(request, buffet_id):
    buffet = get_object_or_404(Buffet, id=buffet_id)
    serializer = BuffetDetailSerializer(buffet)
    return Response({
        'success': True,
        'data': serializer.data
    })

# FBV #2: Search foods by name
@api_view(['GET'])
def search_foods_view(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response({'data': []})
    
    foods = Food.objects.filter(name__icontains=query)[:20]
    serializer = FoodSerializer(foods, many=True)
    return Response({'data': serializer.data})
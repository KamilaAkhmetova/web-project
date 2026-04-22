from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError
from .serializers import RegisterSerializer, UserSerializer, ProfileUpdateSerializer, ProfileResponseSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
            except IntegrityError:
                return Response(
                    {'error': 'User with this username or email already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception:
                return Response(
                    {'error': 'Registration failed due to server error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Пользователь успешно зарегистрирован',
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Введите username и пароль'}, status=status.HTTP_400_BAD_REQUEST)

    username = username.strip()
    user = authenticate(username=username, password=password)

    # Allow login via email as well as username.
    if user is None and '@' in username:
        user_by_email = User.objects.filter(email__iexact=username).first()
        if user_by_email:
            user = authenticate(username=user_by_email.username, password=password)

    # Fallback for case-insensitive username input.
    if user is None:
        user_by_username = User.objects.filter(username__iexact=username).first()
        if user_by_username:
            user = authenticate(username=user_by_username.username, password=password)

    if user is None:
        return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'Успешный вход',
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({'message': 'Успешный выход'}, status=status.HTTP_200_OK)



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = ProfileResponseSerializer(request.user)
        return Response({'status': 'success', 'data': serializer.data})

    serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'status': 'success',
            'message': 'Профиль обновлён',
            'data': ProfileResponseSerializer(request.user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth_view(request):
    return Response({
        'is_authenticated': True,
        'user': UserSerializer(request.user).data
    })
    
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        return Response({'access': str(refresh.access_token)})
    except Exception:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
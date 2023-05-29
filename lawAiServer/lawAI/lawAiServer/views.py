from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dj_rest_auth.registration.views import RegisterView as DjRestAuthRegisterView
from dj_rest_auth.views import LoginView as DjRestAuthLoginView
from django.http import JsonResponse
from rest_framework.authtoken.models import Token


from .models import CustomUser, UserProfile
from .serializers import UserSerializer, UserProfileSerializer, UserRegisterSerializer

class CustomRegisterView(DjRestAuthRegisterView):
    serializer_class = UserRegisterSerializer

class CustomLoginView(DjRestAuthLoginView):
    serializer_class = UserSerializer

@api_view(['POST'])
def register(request):
    # Parse the incoming data
    data = {
        'email': request.data.get('email'),
        'password': request.data.get('password'),
        'profile': {
            'first_name': request.data.get('profile[first_name]'),
            'last_name': request.data.get('profile[last_name]'),
            'phone_number': request.data.get('profile[phone_number]')
        }
    }

    serializer = UserRegisterSerializer(data=data)
    
    if serializer.is_valid():
        user_data = serializer.validated_data
        user_data['password'] = make_password(user_data['password'])
        user = serializer.create(user_data)
        token, _ = Token.objects.get_or_create(user=user)  # get or create the token
        data = {
            'response': 'Successfully registered new user.',
            'email': user.email,
            'token': token.key
        }
        return Response(data, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors: ", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    view = CustomLoginView.as_view()
    response = view(request._request)
    if response.status_code == status.HTTP_200_OK:
        return Response({'token': response.data['key']}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid Credentials'}, status=response.status_code)

from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.authtoken.models import Token

from .models import CustomUser
from .serializers import UserRegisterSerializer
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView


class CustomRegisterView(RegisterView):
    serializer_class = UserRegisterSerializer

class CustomLoginView(LoginView):
    serializer_class = UserRegisterSerializer



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
    print("Received data: ", data)

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
    print(request.data)  # Debug: print request data
    email = request.data.get('email')
    password = request.data.get('password')
    profile = {}  # Initialize an empty profile dictionary

    data = {
        'email': email,
        'password': password,
        'profile': profile  # Include the profile field in the data dictionary
    }
    print("Login Request Parameters:", data)

    view = CustomLoginView.as_view()
    response = view(request._request)
    print(response.data)  # Debug: print response data
    print(response.status_code)  # Debug: print response status code
    return response



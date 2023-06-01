from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

from .serializers import UserRegisterSerializer
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView


class CustomRegisterView(RegisterView):
    serializer_class = UserRegisterSerializer

class CustomLoginView(LoginView):
    serializer_class = UserRegisterSerializer


@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    profile = {
        'first_name': request.data.get('profile', {}).get('first_name', ''),
        'last_name': request.data.get('profile', {}).get('last_name', ''),
        'phone_number': request.data.get('profile', {}).get('phone_number', ''),
    }

    user_data = {
        'email': email,
        'password': password,
        'profile': profile,
    }

    serializer = UserRegisterSerializer(data=user_data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        data = {
            'response': 'Successfully registered new user.',
            'email': user.email,
            'token': token.key
        }
        return Response(data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
@api_view(['POST'])
def login(request):
    print(request.data)  # Debug: print request data
    email = request.data.get('email')
    password = request.data.get('password')

    view = CustomLoginView.as_view()
    response = view(request)
    print(response.data)  # Debug: print response data
    print(response.status_code)  # Debug: print response status code
    return response

from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from dj_rest_auth.registration.views import RegisterView as DjRestAuthRegisterView
from dj_rest_auth.views import LoginView as DjRestAuthLoginView
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .models import CustomUser
from rest_framework import serializers




User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
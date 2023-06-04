from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Conversation, Message


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


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(slug_field='email', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'timestamp', 'is_user_message']


class ConversationSerializer(serializers.ModelSerializer):
    created_by = serializers.SlugRelatedField(slug_field='email', read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'created_by', 'messages', 'created_at']

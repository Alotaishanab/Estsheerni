from django.contrib.auth import get_user_model, authenticate
from rest_framework import status, permissions, exceptions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.shortcuts import render
from .serializers import UserSerializer
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from base64 import b64encode, b64decode
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.cache import cache

User = get_user_model()

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user_data = {
        'email': email,
        'password': password,
        'first_name': request.data.get('first_name', ''),
        'last_name': request.data.get('last_name', ''),
        'phone_number': request.data.get('phone_number', ''),
    }

    serializer = UserSerializer(data=user_data)
    if serializer.is_valid():
        user = serializer.save()
        data = {
            'response': 'Successfully registered new user.',
            'email': user.email,
        }
        return Response(data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=email, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        data = {
            'response': 'Successfully logged in.',
            'email': user.email,
            'token': token.key
        }
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid login credentials."}, status=status.HTTP_400_BAD_REQUEST)

# place holder till we create a actual ai 
def get_ai_user(): # a function to get the AI user
    pass


def encrypt_message(content):
    cipher = AES.new(os.getenv('SECRET_KEY')[:16], AES.MODE_ECB)
    ciphertext = cipher.encrypt(pad(content.encode(), 16))
    return b64encode(ciphertext).decode()

def decrypt_message(ciphertext):
    try:
        cipher = AES.new(os.getenv('SECRET_KEY')[:16], AES.MODE_ECB)
        content = unpad(cipher.decrypt(b64decode(ciphertext)), 16)
        return content.decode()
    except Exception:
        return None

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def conversation_list(request):
    if request.method == 'GET':
        conversations = Conversation.objects.filter(created_by=request.user)
        data = []
        for conversation in conversations:
            conversation_data = cache.get(f'conversation_{conversation.id}')
            if not conversation_data:
                serializer = ConversationSerializer(conversation)
                conversation_data = serializer.data
                cache.set(f'conversation_{conversation.id}', conversation_data, 300)
            data.append(conversation_data)
        return Response(data)
    elif request.method == 'POST':
        serializer = ConversationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            cache.delete('conversation_list')  # Delete the cache as new conversation has been created
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def conversation_detail(request, pk):
    try:
        conversation = Conversation.objects.select_related('created_by').prefetch_related('messages').get(pk=pk)
    except Conversation.DoesNotExist:
        raise exceptions.NotFound("A conversation with this ID does not exist.")

    if request.method == 'GET':
        if conversation.created_by != request.user:
            raise exceptions.PermissionDenied("You cannot view another user's conversation.")
        # Decrypt the messages before sending them
        for message in conversation.messages.all():
            try:
                message.content = decrypt_message(message.content)
            except ValidationError as ve:
                return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            request.data['content'] = encrypt_message(request.data.get('content', ''))
        except ValidationError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data['conversation'].created_by != request.user:
                raise exceptions.PermissionDenied("You cannot post a message in another user's conversation.")
            
            message = serializer.save()
            cache.delete(f'conversation_{message.conversation.id}')  # Invalidate the cache
            
            # Call a function to generate AI response
            response_content = encrypt_message('AI response coming soon...')
            
            # Create a new message for the AI's response
            response_message = Message.objects.create(
                conversation=message.conversation,
                sender=get_ai_user(),  # a function to get the AI user
                content=response_content,
                is_user_message=False
            )
            return Response(MessageSerializer(response_message).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
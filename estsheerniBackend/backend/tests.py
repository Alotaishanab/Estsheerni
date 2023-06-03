from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from .serializers import UserSerializer, UserRegisterSerializer, ConversationSerializer, MessageSerializer
from django.urls import reverse
from django.utils.crypto import get_random_string
import uuid
from rest_framework.authtoken.models import Token
from .views import register, login, conversation_list, conversation_detail
from .models import Conversation


User = get_user_model()


class CustomUserTestCase(TestCase):
    def setUp(self):
        self.user_data = {
            'email': f'test{uuid.uuid4()}@example.com',  # Email is unique for each test
            'password': 'test123',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '1234567890'
        }
        print('Creating user in CustomUserTestCase with email:', self.user_data['email'])
        self.user = User.objects.create_user(**self.user_data)

    def test_create_user(self):
        self.assertEqual(self.user.email, self.user_data['email'])
        self.assertTrue(self.user.check_password(self.user_data['password']))
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)

    def test_create_superuser(self):
        superuser_data = {
            'email': 'admin@example.com',
            'password': 'admin123',
            'first_name': 'Admin',
            'last_name': 'User',
            'phone_number': '9876543210',
            'is_staff': True,
            'is_superuser': True
        }
        superuser = User.objects.create_superuser(**superuser_data)
        self.assertEqual(superuser.email, superuser_data['email'])
        self.assertTrue(superuser.check_password(superuser_data['password']))
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)


class UserSerializerTestCase(TestCase):
    def setUp(self):
        self.user_data = {
            'email': f'test{uuid.uuid4()}@example.com',  # Email is unique for each test
            'password': 'test123',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '1234567890'
        }

    def test_user_serializer_create(self):
        serializer = UserSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))

    def test_user_register_serializer_create(self):
        serializer = UserRegisterSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))


class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_data = {
            'email': f'{get_random_string(10)}{uuid.uuid4()}@example.com',  # Email is unique for each test
            'password': 'test123',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '1234567890'
        }
        print('Creating user in AuthenticationTestCase with email:', self.user_data['email'])
    

    def test_user_registration(self):
        print('Running test_user_registration with user data:', self.user_data)
        response = self.client.post(self.register_url, data=self.user_data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertTrue('token' in response.data)

    def test_user_login(self):
         # Register the user first
         self.client.post(self.register_url, data=self.user_data, format='json')
    
         login_data = {
        'email': self.user_data['email'],
        'password': self.user_data['password']
         }
         response = self.client.post(self.login_url, data=login_data)
         self.assertEqual(response.status_code, status.HTTP_200_OK)



'''class URLConfigTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.test_email = f'testuser{uuid.uuid4()}@example.com'  # Email is unique for each test
        self.test_password = 'testpassword'
        self.user = User.objects.create_user(email=self.test_email, password=self.test_password)
        self.client.force_authenticate(user=self.user)

    def test_url_config(self):
        login_data = {
            'email': self.test_email,
            'password': self.test_password
        }
        response = self.client.post('/login/', data=login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        register_data = {
            'email': f'register{uuid.uuid4()}@example.com',  # Unique email for registration
            'password': 'registerpassword',
            'first_name': 'Register',
            'last_name': 'User',
            'phone_number': '1234567890'
        }

        response = self.client.post('http://localhost:8000/login/', data=login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('http://localhost:8000/register/', data=register_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get('http://localhost:8000/auth/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get('http://localhost:8000/auth/jwt/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get('http://localhost:8000/auth/authtoken/')
        self.assertEqual(response.status_code, status.HTTP_200_OK) '''

class CustomUserTestCase(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email='test@test.com', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.api_client = APIClient()
        self.api_client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_register_view(self):
        response = self.client.post('http://localhost:8000/register/', {
            'email': 'newuser@test.com',
            'password': 'newuserpassword',
            'profile': {
                'first_name': 'New',
                'last_name': 'User',
                'phone_number': '1234567890',
            },
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['email'], 'newuser@test.com')

    def test_login_view(self):
        response = self.client.post('http://localhost:8000/login/', {
            'email': 'test@test.com',
            'password': 'testpassword',
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data)
    '''
    def test_conversation_list_view(self):
        response = self.api_client.get('/api/conversations/')
        self.assertEqual(response.status_code, 200)

    def test_conversation_detail_view(self):
        conversation = Conversation.objects.create(created_by=self.user)
        response = self.api_client.get(f'/conversations/{conversation.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], conversation.pk)

    def test_message_create_view(self):
        conversation = Conversation.objects.create(created_by=self.user)
        #No need to pass 'sender', it should be automatically set by your view.
        response = self.api_client.post(f'/api/conversations/{conversation.pk}/', {
            'conversation': conversation.pk,
            'content': 'Test message',
         })
        self.assertEqual(response.status_code, 201)
        self.assertTrue('id' in response.data)
    '''

      

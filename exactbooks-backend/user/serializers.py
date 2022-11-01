

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator

from user.models import User
import datetime

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'image',
            'date_joined',
            'date_updated',
        )
    def __init__(self, *args, **kwargs):
        return super(UserSerializer, self).__init__(*args, **kwargs)

    def get_image(self, instance):
        return instance.get_image()

    def get_full_name(self, instance):
        return instance.get_full_name()

class AuthenticationSerializer(serializers.Serializer):
    user = None
    email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        return super(AuthenticationSerializer, self).__init__(*args, **kwargs)

    def validate(self, data):
        email, password = data.values()
        if not email:
            raise serializers.ValidationError({"email": "Email cannot be blank"})
        if not password:
            raise serializers.ValidationError({"password": "password cannot be blank"})
            
        self.user = self.user = authenticate(request=self.request, email=email, password=password)

        if self.user:
            login(self.request, self.user)
        else:
            raise serializers.ValidationError({"error": "Invalid credentials"})
        return data

    def get_token(self):
        if not self.user:
             raise serializers.ValidationError({"error": "Unauthorized"})

        token, created = Token.objects.get_or_create(user=self.user)
        expiry_date = token.created + datetime.timedelta(days=7)

        if not created and expiry_date < timezone.now():
            token.delete()
            token = Token.objects.create(user=self.user)
        return token

class RegistrationSerializer(serializers.ModelSerializer):
    user = None
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="This email is already taken."
        )]
    )
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
            'confirm_password',
        )

    def validate(self, data):
        if User.objects.get(email=data.get('email')):
            raise serializers.ValidationError({"email": "Email is already taken"})

        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"password": "Password does not match"})
        return data

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.is_active = True
        user.save()
        return user

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'
        
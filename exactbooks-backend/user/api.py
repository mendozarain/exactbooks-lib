from django.contrib.auth import logout

from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from user.serializers import (
    AuthenticationSerializer,
    UserSerializer,
    RegistrationSerializer,
)
from user.models import User as UserModel
from core.mixins import get_object_or_none

class Login(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = AuthenticationSerializer

    def post(self, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data, request=self.request)
        if not serializer.is_valid():
            return Response(serializer.errors, status=401)
        token, created = Token.objects.get_or_create(user=serializer.user)
        return Response({
            'user_id': serializer.user.id,
            'token': token.key,
            'user_image':serializer.user.get_image(),
            'user_name':serializer.user.get_full_name(),
        }, status=200)

class Register(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(status=200)
        return Response(serializer.errors, status=400)

class Users(ViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    def get(self, *args, **kwargs):
        users = UserModel.objects.all()
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data, status=200)

class User(ViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    parser_class = (MultiPartParser,)

    def get(self, *args, **kwargs):
        serializer = self.serializer_class(instance=self.request.user)
        return Response(serializer.data, status=200)

    def get_by_id(self, *args, **kwargs):
        user = get_object_or_none(UserModel, id=self.kwargs.get('id'))
        if user:
            serializer = self.serializer_class(instance=user)
            return Response(serializer.data, status=200)
        return Response(status=400)

    def update(self, *args, **kwargs):
        serializer = self.serializer_class(
            data=self.request.data,
            instance=self.request.user
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)
        
class Logout(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, *args, **kwargs):
        logout(self.request)
        return Response(status=204)

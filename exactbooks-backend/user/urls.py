from django.contrib import admin
from django.urls import path, include
from user.api import (
    Users,
    Login,
    Logout,
    User,
    Register,
)

urlpatterns = [
    path('', Users.as_view({
        'get': 'get',
    }), name="users_list"),
    path('auth/', User.as_view({
        'get': 'get',
        'post': 'update',
    }), name="user_detail"),
    path('<int:id>/', User.as_view({
        'get': 'get_by_id',
    }), name="user_by_id"),
    path('register/', Register.as_view(), name="register"),
    path('login/', Login.as_view(), name="login"),
    path('logout/', Logout.as_view(), name="logout"),
]

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import UserManager, BaseUserManager
from django.conf import settings
from uuid import uuid4
import os
from django.core.files.storage import FileSystemStorage
from core.mixins import OverwriteStorage

def path_and_rename(instance, filename):
    upload_to = 'users'
    ext = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, ext)
    else:
        filename = '{}.{}'.format(uuid4().hex, ext)
    return os.path.join(upload_to, filename)

class UserManager(BaseUserManager):

    use_in_migrations = True

    def create_user(self, email, password=None,):
        if not email and not password:
            raise ValueError('Credentials cannot be blank,')
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return 

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=500, unique=True)
    first_name = models.CharField(max_length=120, null=True, blank=True)
    last_name = models.CharField(max_length=120, null=True, blank=True)
    image = models.ImageField(upload_to=path_and_rename,default='users/default.png',storage=OverwriteStorage(),blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    objects = UserManager()
    REQUIRED_FIELDS = []

    def __str__(self):
        return "{}".format(self.email)

    def get_image(self):
        return '{}{}'.format(settings.MEDIA_URL,str(self.image))
    
    def get_full_name(self):
        if self.first_name and self.last_name:
            return "{} {}".format(self.first_name, self.last_name)
        return self.email
   
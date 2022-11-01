from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission
from django.utils.translation import gettext_lazy as _
from user.models import User

class UserAdmin(UserAdmin):
    model = User
    ordering = ('email','date_joined')
    readonly_fields = ('date_joined',)
    list_display = ('email', 'first_name', 'last_name', 'date_joined')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'image',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
            'groups', 'user_permissions',)}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
admin.site.register(User, UserAdmin)
admin.site.register(Permission)
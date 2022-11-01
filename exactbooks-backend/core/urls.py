from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path(
        'api/users/',
        include(('user.urls', 'user'), namespace='user')
    ),
    path(
        'api/books/',
        include(('books.urls', 'books'), namespace='books')
    ),
]

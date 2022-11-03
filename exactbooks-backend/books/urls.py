from django.contrib import admin
from django.urls import path, include
from books.api import (
    # AuthorViewSet, 
    BookViewSet, 
    CheckoutViewSet,
    CommentViewSet, 
)
urlpatterns = [
    path('', BookViewSet.as_view({
        'get': 'get_all_books',
    }), name="books_list"),
    path('<int:id>/', BookViewSet.as_view({
        'get': 'get_detail',
    }), name="get_detail"),
    path('status', CheckoutViewSet.as_view({
        'get': 'status'
    }), name='status'),
    path('add/', BookViewSet.as_view({
        'post': 'add_book',
    }), name="add_book"),
    path('update/', BookViewSet.as_view({
        'put': 'update_book',
    }), name="update_book"),
    path('owned/', BookViewSet.as_view({
        'get': 'owned_books',
    }), name="owned_books"),
    path('comments/', CommentViewSet.as_view({
        'get': 'get_comments'
    }), name='comment_list'),
    path('add-comment/', CommentViewSet.as_view({
        'post': 'add_comment'
    }), name='add_comment'),
    path('delete-comment/', CommentViewSet.as_view({
        'post': 'delete_comment'
    }), name='delete_comment'),
    path('borrowed/', CheckoutViewSet.as_view({
        'get': 'get_borrowed_books',
    }), name="borrowed_books"),
    path('checkout/', CheckoutViewSet.as_view({
        'post': 'checkout_book'
    }), name='checkout_book'),
     path('ischeckedout/<int:id>', CheckoutViewSet.as_view({
        'get': 'is_checked_out'
    }), name='checkout_book'),
    path('return/', CheckoutViewSet.as_view({
        'post': 'return_book'
    }), name='return_book'),
   
]
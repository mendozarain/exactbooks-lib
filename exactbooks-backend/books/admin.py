from django.contrib import admin
from .models import (
    Book, 
    Author,
    Genre, 
    Checkout, 
    Comment
)

class BookAdmin(admin.ModelAdmin):
    model = Book
    ordering = ('date_created',)
    filter_horizontal = ('authors', 'genres')
    list_display = ('title',
                'description',
                'status',
                'book_type',
                'location',
                'owner',
                'get_genres',
                'date_created',
                'date_updated'
            )
    readonly_fields = ('date_created', 'date_updated')
    search_fields = ('title', 'status', 'location', 'book_type',)
  
class GenreAdmin(admin.ModelAdmin):
    model = Genre
    ordering = ('id',)
    search_fields = ('name',)
    list_display = ('id', 'name')


class AuthorAdmin(admin.ModelAdmin):
    model = Author
    ordering = ('id',)
    search_fields = ('name',)
    list_display = ('id', 'name')


class CheckoutAdmin(admin.ModelAdmin):
    model = Checkout
    ordering = ('book',)
    readonly_fields = ('checked_out_date', 'returned_date')
    list_display = ('book',
                    'checked_out_by',
                    'checked_out_date',
                    'returned_date'
                )

class CommentAdmin(admin.ModelAdmin):
    model = Comment
    ordering = ('date_created',)
    readonly_fields = ('date_created', 'date_updated')
    list_display = ('text',
                    'user',
                    'book',
                    'reply_to',
                    'date_created',
                    'date_updated'
                )
admin.site.register(Checkout, CheckoutAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(Genre, GenreAdmin)


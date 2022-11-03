from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _
from drf_extra_fields.fields import Base64ImageField
from user.serializers import UserSerializer
from books.models import (
    Book, 
    Author, 
    Comment, 
    Genre, 
    Checkout
)

class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = ('id', 'name')

    def __init__(self, *args, **kwargs):
        return super(AuthorSerializer, self).__init__(*args, **kwargs)

class BookSerializer(serializers.ModelSerializer):
    owner = UserSerializer(required=False, allow_null=True, default=None)
    authors = AuthorSerializer(required=False, allow_null=True, many=True)
    cover = serializers.ImageField(required=False)
    cover_image = serializers.ReadOnlyField(source='get_cover')
    book_id = serializers.ReadOnlyField(source='get_id')

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        return super(BookSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = Book
        fields = ('id', 'book_id', 'title', 'description', 'book_type', 'status', 'location',
                  'cover', 'authors', 'owner', 'date_created', 'date_updated','cover_image')

    def get_cover(self, instance):
        return instance.get_cover()

    def get_id(self, instance):
        return instance.get_id()

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({"title": "Title cannot be blank"})
        if not data.get('book_type'):
            raise serializers.ValidationError({"book_type": "Type cannot be blank"})
        if not data.get('location'):
            raise serializers.ValidationError({"location": "Location cannot be blank"})
    
       
        return data

    def create(self, validated_data):
        book = Book(
            title=validated_data.get('title', None),
            location=validated_data.get('location', None),
            status=validated_data.get('status', 'available'),
            book_type=validated_data.get('book_type', None),
            owner=self.request.user,
            description=validated_data.get('description', None),
        )
        if validated_data.get('cover'):
            book.cover=validated_data.get('cover')
        book.save()

    
        if self.request.data.get('authors'):
            authors = self.request.data.get('authors')
            authors_list = []
            if not ',' in authors:
                authors_list.append({'value':authors})
            else:
                for author in self.request.data['authors'].split(','):
                    authors_list.append({'value':author})

            for data in authors_list:
                author, created = Author.objects.get_or_create(name=data.get('value'))
                if author:
                    book.authors.add(author)
                else:
                    book.authors.add(created)
        if self.request.data.get('genres'):
            for data in self.request.data.get('genres'):
                genre, created = Genre.objects.get_or_create(name=data.get('value'))
                if genre:
                    book.genres.add(genre)
                else:
                    book.genres.add(created)
       

    def update(self, instance, validated_data):

        authors = self.request.data.get('authors')
        authors_list = []
        if authors.endswith(','):
            authors = self.request.data.get('authors')[:-1]
        if not ',' in authors:
            authors_list.append({'value':authors})
        else:
            for author in self.request.data['authors'].split(','):
                authors_list.append({'value':author})
        
        title = validated_data.get('title', None)
        status = validated_data.get('status', None)
        description = validated_data.get('description', None)
        book_type = validated_data.get('book_type', None)
        genres = self.request.data.get('genres')
        location = validated_data.get('location', None)
        cover = validated_data.get('cover', None)
        authors = authors_list
        if title:
            instance.title = title
        if status:
            instance.status = status
        if description:
            instance.description = description
        if book_type:
            instance.book_type = book_type
        if location:
            instance.location = location
        if cover:
            instance.cover = cover

        instance.authors.clear()
        if authors:
            for data in authors:
                author, created = Author.objects.get_or_create(name=data.get('value'))
                if author:
                    instance.authors.add(author)
                else:
                    instance.authors.add(created)
        instance.genres.clear()
        if genres:
            for data in genres:
                genres, created = Author.objects.get_or_create(name=data.get('value'))
                if author:
                    instance.genres.add(author)
                else:
                    instance.genres.add(created)
        instance.save()
        return instance
        
    def save(self, **kwargs):
        validated_data = dict(list(self.validated_data.items()) + list(kwargs.items()))
        if not self.instance:
            self.instance = self.create(validated_data)
        else:
            self.instance = self.update(self.instance, validated_data)
        return self.instance

class CheckoutSerializer(serializers.ModelSerializer):

    book = BookSerializer(required=False, allow_null=True)
    checked_out_by = UserSerializer(required=False, allow_null=True)

    class Meta:
        model=Checkout
        fields = ('id', 'book', 'checked_out_by', 'checked_out_date', 'returned_date')

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        return super(CheckoutSerializer, self).__init__(*args, **kwargs)

class CommentSerializer(serializers.ModelSerializer):

    book = BookSerializer(required=False, allow_null=True)
    user = UserSerializer(required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = ('id', 'message', 'book', 'user', 'date_created', 'date_updated')

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        return super(CommentSerializer, self).__init__(*args, **kwargs)

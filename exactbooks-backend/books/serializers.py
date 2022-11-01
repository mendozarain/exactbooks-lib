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
    cover = Base64ImageField(required=False)
    comment_count = serializers.SerializerMethodField(read_only=True)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        return super(BookSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = Book
        fields = ('id', 'title', 'description', 'type', 'status', 'location', 'comment_count',
                  'thumbnail', 'authors', 'owner', 'date_created', 'date_updated')

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({"title": "Title cannot be blank"})
        if not data.get('description'):
            raise serializers.ValidationError({"description": "Description cannot be blank"})
        if not data.get('type'):
            raise serializers.ValidationError({"type": "Type cannot be blank"})
        if not data.get('status'):
            raise serializers.ValidationError({"status": "Status cannot be blank"})
        if not data.get('location'):
            raise serializers.ValidationError({"location": "Location cannot be blank"})

    def create(self, validated_data):
        book = Book(
            title=validated_data.get('title', None),
            location=validated_data.get('location', None),
            status=validated_data.get('status', None),
            type=validated_data.get('type', None),
            owner=self.request.user,
            description=validated_data.get('description', None),
        )
        if validated_data.get('thumbnail'):
            book.thumbnail=validated_data.get('thumbnail')

        for data in self.request.data.get('authors'):
            author, created = Author.objects.get_or_create(name=data.get('value'))
            if author:
                book.authors.add(author)
            else:
                book.authors.add(created)
        for data in self.request.data.get('genres'):
            genre, created = Genre.objects.get_or_create(name=data.get('value'))
            if genre:
                book.genres.add(genre)
            else:
                book.genres.add(created)
        book.save()

    def update(self, instance, validated_data):
        title = validated_data.get('title', None)
        status = validated_data.get('status', None)
        description = validated_data.get('description', None)
        type = validated_data.get('type', None)
        genres = self.request.data.get('genres')
        location = validated_data.get('location', None)
        authors = self.request.data.get('authors')
        if title:
            instance.title = title
        if status:
            instance.status = status
        if description:
            instance.description = description
        if type:
            instance.type = type
        if location:
            instance.location = location

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

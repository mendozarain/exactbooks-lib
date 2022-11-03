from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from books.models import (
    Book, 
    Checkout, 
    Comment,
    Author, 
)

from books.serializers import (
    BookSerializer, 
    CheckoutSerializer,
    CommentSerializer, 
    AuthorSerializer, 
)
import datetime
from core.mixins import get_object_or_none

class BookViewSet(ViewSet):
    serializer_class = BookSerializer
    permission_classes = (IsAuthenticated,)

    def add_book(self, *args, **kwargs):
        serializer = self.serializer_class(
            data=self.request.data, request=self.request
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response({}, status=200)

    def get_all_books(self, *args, **kwargs):
        books = Book.objects.all().order_by('-date_created')
        serializer = self.serializer_class(books, many=True)
        return Response(serializer.data, status=200)

    def get_owned_books(self, *args, **kwargs):
        serializer = self.serializer_class(
            instance=Book.objects.filter(owner=self.request.user),
            many=True,
        )
        return Response(serializer.data, status=200)

    def update_book(self, *args, **kwargs):
        serializer = self.serializer_class(
            instance=Book.objects.get(id=self.request.data.get('id')),
            data=self.request.data,
            request=self.request
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status=200)
    
    def get_detail(self, *args, **kwargs):
        book = get_object_or_none(Book, id=self.kwargs.get('id'))
        if book:
            serializer = self.serializer_class(instance=book)
            return Response(serializer.data, status=200)
        return Response(status=400)


class CheckoutViewSet(ViewSet):
    serializer_class = CheckoutSerializer
    permission_classes = (IsAuthenticated,)

    def get_borrowed_books(self, *args, **kwargs):
        serializer = self.serializer_class(
            instance=Checkout.objects.filter(
                checked_out_by=self.request.user
            ).order_by('-checked_out_date'),
            many=True,
        )
        return Response(serializer.data, status=200)

    def is_checked_out(self, *args, **kwargs):
        book_obj = Book.objects.get(id=kwargs['id'])
        message = {'status': False}
        if book_obj.status != 'available':
            checkout = Checkout.objects.filter(checked_out_by=self.request.user)
            for check in checkout:
                if check.book.id == kwargs['id']:
                    if not check.returned_date:
                        message['status'] = True
            return Response(message, status=200)
        return Response(message, status=200)

    def checkout_book(self, *args, **kwargs):
        data = self.request.data
        try:
            book_obj = Book.objects.get(id=data.get('book_id'))
            if book_obj.status != 'available':
                message = {'status': 'Book is currently unavailable'}
                return Response(message, status=400)
            else:
                if book_obj.owner == self.request.user:
                    message = {'status': 'You are the owner of this book'}
                    return Response(message, status=400)
                else:
                    checkout_obj = Checkout.objects.create(
                        book=book_obj,
                        checked_out_by=self.request.user
                    )
                    book_obj.status=Book.CHECKED_OUT
                    book_obj.save()
                    message = {'status': 'Success'}
        except:
            message = {'status': 'Something went wrong try again'}
            return Response(message, status=400)
        return Response(message, status=200)

    def return_book(self, *args, **kwargs):
        data = self.request.data
        try:
            book_obj = Book.objects.get(id=data.get('book_id'))
            if book_obj.status == 'checked out':
                if book_obj.owner == self.request.user:
                    message = {'status': 'You are the owner of this book'}
                    return Response(message, status=400)
                else:
                    checkout_obj = Checkout.objects.get(
                        book=book_obj,
                        checked_out_by=self.request.user,
                        returned_date__isnull=True
                    )
                    checkout_obj.returned_date = datetime.datetime.now()
                    book_obj.status=Book.AVAILABLE
                    checkout_obj.save()
                    book_obj.save()
                    message = {'status': 'Success'}
                    return Response(message, status=200)
            else:
                message = {'status': 'Book is currently unavailable'}
                return Response(message, status=400)
        except:
            message = {'status': 'Something went wrong try again'}
            return Response(message, status=400)
        
class CommentViewSet(ViewSet):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_comments(self, *args, **kwargs):
        serializer = self.serializer_class(
            instance=Comment.objects.filter(
                book__id=kwargs['id'],
            ).order_by('date_created'),
            many=True,
        )
        return Response(serializer.data, status=200)

    def add_comment(self, *args, **kwargs):
        data = self.request.data
        if data.get('message') == 'undefined' or data.get('message').replace(" ", "") == "":
            message = {'status': 'You must say something!'}
            return Response(message, status=400)   
        try:
            book = Book.objects.get(id=data.get('book_id'))
            comment = Comment.objects.create(
                text=data.get('message'),
                user=self.request.user,
                book=book,
            )
            serializer = self.serializer_class(
                instance=comment,
            )
        except:
            message = {'status': 'An error has occured. Please try again.'}
            return Response(message, status=400)
        return Response(serializer.data, status=200)

    def delete_comment(self, *args, **kwargs):
        data = self.request.data
        try:
            comment = Comment.objects.get(id=data.get('comment_id'))
            comment.is_deleted = True
            comment.save()
            message = {'status': 'Success'}
        except:
            message = {'status': 'An error has occured. Please try again.'}
            return Response(message, status=400)
        return Response(message, status=200)
class AuthorViewSet(ViewSet):
    serializer_class = AuthorSerializer
    permission_classes = (AllowAny,)

    def get(self, *args, **kwargs):
        authors = Author.objects.all()
        serializer = self.serializer_class(authors, many=True)
        return Response(serializer.data, status=200)
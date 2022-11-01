from django.db import models
from user.models import User
from uuid import uuid4
import os
from core.mixins import OverwriteStorage

def path_and_rename(instance, filename):
    upload_to = 'books'
    ext = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, ext)
    else:
        filename = '{}.{}'.format(uuid4().hex, ext)
    return os.path.join(upload_to, filename)

class Author(models.Model):
    name = models.CharField(max_length=255, blank=True)
    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=255, blank=True)
    def __str__(self):
        return self.name

class Book(models.Model):
    AVAILABLE = 'available'
    CHECKED_OUT = 'checked out'
    DAMAGED = 'damaged'
    LOST = 'lost'

    STATUSES = (
        (AVAILABLE, 'Available'),
        (CHECKED_OUT, 'Checked Out'),
        (DAMAGED, 'Damaged'),
        (LOST, 'Lost'),
    )

    EXACTUS_OFFICE = 'exactus office'
    OWNERS_HOME = "owner's home"
    IN_THE_MATRIX = 'in the matrix'

    LOCATIONS = (
        (EXACTUS_OFFICE, 'Exactus Office'),
        (OWNERS_HOME, "Owner's Home"),
        (IN_THE_MATRIX, 'In the Matrix'),
    )
    
    HARDCOVER = 'hardcover'
    PAPERBACK = 'paperback'
    DIGITAL_COPY = 'digital copy'

    TYPES = (
        (HARDCOVER, 'Hardcover'),
        (PAPERBACK, 'Paperback'),
        (DIGITAL_COPY, 'Digital Copy')
    )

    status = models.CharField(default=AVAILABLE, max_length=20, choices=STATUSES)
    book_type = models.CharField(default=HARDCOVER, max_length=20, choices=TYPES)
    location = models.CharField(default=EXACTUS_OFFICE, max_length=30, choices=LOCATIONS)
    title = models.CharField(max_length=255)
    authors = models.ManyToManyField(Author, blank=True)
    genres = models.ManyToManyField(Genre,related_name='genres')
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    cover = models.ImageField(upload_to=path_and_rename,default='books/default_cover.png',storage=OverwriteStorage(),blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def get_genres(self):
        return ",".join([str(g) for g in self.genres.all()])

    def __str__(self):
        return "{}".format(self.title)

class Comment(models.Model):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    reply_to = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

class Checkout(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    returned_date = models.DateTimeField(blank=True, null=True)
    checked_out_by = models.ForeignKey(User, on_delete=models.CASCADE)
    checked_out_date = models.DateTimeField(auto_now_add=True)
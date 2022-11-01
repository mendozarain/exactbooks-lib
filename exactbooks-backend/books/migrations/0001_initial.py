# Generated by Django 3.2.4 on 2022-10-31 04:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('available', 'Available'), ('checked out', 'Checked Out'), ('damaged', 'Damaged'), ('lost', 'Lost')], default='available', max_length=20)),
                ('book_type', models.CharField(choices=[('hardcover', 'Hardcover'), ('paperback', 'Paperback'), ('digital copy', 'Digital Copy')], default='hardcover', max_length=20)),
                ('location', models.CharField(choices=[('exactus office', 'Exactus Office'), ("owner's home", "Owner's Home"), ('in the matrix', 'In the Matrix')], default='exactus office', max_length=30)),
                ('title', models.CharField(max_length=255)),
                ('plot', models.TextField(blank=True)),
                ('cover', models.ImageField(upload_to='books/<function Book.image at 0x7f99e1f1cea0>')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Checkout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('returned_date', models.DateTimeField(blank=True, null=True)),
                ('checked_out_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='books.book')),
                ('reply_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='books.comment')),
            ],
        ),
    ]
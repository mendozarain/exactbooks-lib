# Generated by Django 3.2.4 on 2022-10-31 07:29

from django.db import migrations, models
import user.models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_alter_user_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, default='https://exactbooks.b-cdn.net//user/default.png', null=True, storage=user.models.OverwriteStorage(), upload_to=user.models.path_and_rename),
        ),
    ]

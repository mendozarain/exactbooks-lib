# Generated by Django 3.2.4 on 2022-10-31 09:03

import core.mixins
from django.db import migrations, models
import user.models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_alter_user_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, default='users/default.png', null=True, storage=core.mixins.OverwriteStorage(), upload_to=user.models.path_and_rename),
        ),
    ]

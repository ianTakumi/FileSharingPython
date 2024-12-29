# Generated by Django 5.1.2 on 2024-11-05 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0002_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='public_id',
            field=models.CharField(blank=True, default='pf8iioqsmo9unsmegxrv', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='url',
            field=models.CharField(blank=True, default='https://res.cloudinary.com/dzydn2faa/image/upload/v1730799486/pf8iioqsmo9unsmegxrv.jpg', max_length=255, null=True),
        ),
    ]

# Generated by Django 5.1.2 on 2024-11-03 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('file_management', '0002_file_file_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='ciphertext',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='file',
            name='key',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='file',
            name='nonce',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='file',
            name='tag',
            field=models.TextField(),
        ),
    ]

# Generated by Django 4.1.7 on 2023-06-02 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_conversation_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='conversation',
            old_name='user',
            new_name='created_by',
        ),
    ]
import os

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand

from feedback.models import Feedback
from feedback.permissions import ADMIN_GROUP, STAFF_GROUP, VIEWER_GROUP


class Command(BaseCommand):
    help = 'Create role groups and optionally create a superuser from environment variables.'

    def handle(self, *args, **options):
        content_type = ContentType.objects.get_for_model(Feedback)
        permissions = {
            perm.codename: perm
            for perm in Permission.objects.filter(content_type=content_type)
        }

        admin_group, _ = Group.objects.get_or_create(name=ADMIN_GROUP)
        staff_group, _ = Group.objects.get_or_create(name=STAFF_GROUP)
        viewer_group, _ = Group.objects.get_or_create(name=VIEWER_GROUP)

        admin_group.permissions.set(permissions.values())
        staff_group.permissions.set(
            permissions[codename]
            for codename in ('add_feedback', 'change_feedback', 'view_feedback')
            if codename in permissions
        )
        viewer_group.permissions.set(
            permissions[codename]
            for codename in ('view_feedback',)
            if codename in permissions
        )

        self.stdout.write(self.style.SUCCESS('Role groups are ready.'))

        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not username or not password:
            self.stdout.write(
                'Set DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD to '
                'create an admin user with this command.'
            )
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': True, 'is_superuser': True},
        )

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created.'))
        else:
            self.stdout.write(f'User "{username}" already exists; password was not changed.')

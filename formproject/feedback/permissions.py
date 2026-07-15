from functools import wraps

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect


ADMIN_GROUP = 'Admin'
STAFF_GROUP = 'Staff'
VIEWER_GROUP = 'Viewer'


def in_group(user, group_name):
    return user.is_authenticated and user.groups.filter(name=group_name).exists()


def is_admin(user):
    return user.is_superuser or in_group(user, ADMIN_GROUP)


def can_view_students(user):
    return user.is_authenticated and (
        is_admin(user) or in_group(user, STAFF_GROUP) or in_group(user, VIEWER_GROUP)
    )


def can_add_students(user):
    return user.is_authenticated and (is_admin(user) or in_group(user, STAFF_GROUP))


def can_edit_students(user):
    return can_add_students(user)


def can_delete_students(user):
    return user.is_authenticated and is_admin(user)


def can_export_students(user):
    return user.is_authenticated and is_admin(user)


def role_required(check_func, raise_exception=True):
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def wrapped(request, *args, **kwargs):
            if check_func(request.user):
                return view_func(request, *args, **kwargs)
            if raise_exception:
                raise PermissionDenied
            return redirect('login')

        return wrapped

    return decorator


class RoleRequiredMixin:
    role_check = staticmethod(can_view_students)

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        if not self.role_check(request.user):
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)

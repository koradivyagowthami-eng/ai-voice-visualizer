from django.contrib import admin

from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """Admin configuration for reviewing feedback submissions."""

    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone', 'feedback')
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)

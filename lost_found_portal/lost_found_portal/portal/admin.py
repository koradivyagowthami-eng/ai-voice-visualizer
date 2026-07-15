from django.contrib import admin

from .models import ClaimRequest, Item


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("name", "item_type", "location", "status", "posted_on")
    list_filter = ("item_type", "status")
    search_fields = ("name", "location")


@admin.register(ClaimRequest)
class ClaimRequestAdmin(admin.ModelAdmin):
    list_display = ("item", "full_name", "email", "is_verified", "requested_on")
    list_filter = ("is_verified", "requested_on")
    search_fields = ("full_name", "email", "proof_message")

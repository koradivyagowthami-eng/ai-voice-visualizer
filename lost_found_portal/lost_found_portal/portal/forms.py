from django import forms

from .models import ClaimRequest, Item


class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = [
            "name",
            "item_type",
            "location",
            "image",
        ]


class ClaimRequestForm(forms.ModelForm):
    class Meta:
        model = ClaimRequest
        fields = ["full_name", "email", "phone", "proof_message"]
        widgets = {
            "proof_message": forms.Textarea(
                attrs={
                    "rows": 4,
                    "placeholder": "Mention any unique detail that proves this item is yours.",
                }
            )
        }

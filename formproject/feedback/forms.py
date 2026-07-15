import re

from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import Feedback


class RememberMeAuthenticationForm(AuthenticationForm):
    remember_me = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        label='Remember Me',
    )


class FeedbackForm(forms.ModelForm):
    """ModelForm for feedback plus password fields used only for validation."""

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Create a strong password',
                'autocomplete': 'new-password',
            }
        ),
        help_text='Use 8+ characters with uppercase, lowercase, digit, and special character.',
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Confirm your password',
                'autocomplete': 'new-password',
            }
        )
    )

    class Meta:
        model = Feedback
        fields = ['name', 'email', 'phone', 'feedback']
        widgets = {
            'name': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Enter your full name',
                    'autocomplete': 'name',
                }
            ),
            'email': forms.EmailInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Enter your email address',
                    'autocomplete': 'email',
                }
            ),
            'phone': forms.TextInput(
                attrs={
                    'class': 'form-control',
                    'placeholder': '10-digit phone number',
                    'autocomplete': 'tel',
                    'maxlength': '10',
                    'inputmode': 'numeric',
                }
            ),
            'feedback': forms.Textarea(
                attrs={
                    'class': 'form-control',
                    'placeholder': 'Share your feedback',
                    'rows': 5,
                }
            ),
        }

    def clean_name(self):
        """Validate minimum length and uppercase first character."""
        name = self.cleaned_data['name'].strip()

        if len(name) < 3:
            raise forms.ValidationError('Name must contain at least 3 characters.')

        if not name[0].isupper():
            raise forms.ValidationError('First character of the name must be uppercase.')

        return name

    def clean_phone(self):
        """Validate that phone contains exactly 10 digits."""
        phone = self.cleaned_data['phone'].strip()

        if not phone.isdigit() or len(phone) != 10:
            raise forms.ValidationError('Phone number must contain exactly 10 digits.')

        return phone

    def clean_password(self):
        """Validate password strength without saving it to the database."""
        password = self.cleaned_data['password']
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$'

        if not re.match(pattern, password):
            raise forms.ValidationError(
                'Password must contain at least 8 characters, one uppercase letter, '
                'one lowercase letter, one digit, and one special character.'
            )

        return password

    def clean(self):
        """Validate password confirmation after individual field validation."""
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            self.add_error('confirm_password', 'Password and confirm password must match.')

        return cleaned_data

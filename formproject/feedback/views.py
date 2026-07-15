from django.contrib import messages
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, TemplateView

from .forms import FeedbackForm, RememberMeAuthenticationForm
from .models import Feedback
from .permissions import RoleRequiredMixin, can_add_students, can_view_students


class RememberMeLoginView(LoginView):
    authentication_form = RememberMeAuthenticationForm
    template_name = 'registration/login.html'
    redirect_authenticated_user = True

    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')
        if not remember_me:
            self.request.session.set_expiry(0)
        return super().form_valid(form)


class FeedbackCreateView(LoginRequiredMixin, RoleRequiredMixin, CreateView):
    """Displays the feedback form and saves valid submissions."""

    model = Feedback
    form_class = FeedbackForm
    template_name = 'feedback_form.html'
    success_url = reverse_lazy('feedback:success')
    role_check = staticmethod(can_add_students)

    def form_valid(self, form):
        messages.success(self.request, 'Your feedback has been submitted successfully.')
        return super().form_valid(form)


class SuccessView(LoginRequiredMixin, RoleRequiredMixin, TemplateView):
    """Displays confirmation after a successful feedback submission."""

    template_name = 'success.html'
    role_check = staticmethod(can_view_students)

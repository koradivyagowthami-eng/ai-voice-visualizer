from django.urls import path

from .views import FeedbackCreateView, SuccessView


app_name = 'feedback'

urlpatterns = [
    path('', FeedbackCreateView.as_view(), name='home'),
    path('success/', SuccessView.as_view(), name='success'),
]

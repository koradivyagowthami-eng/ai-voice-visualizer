"""Routes for the converter app."""

from django.urls import path

from . import views

urlpatterns = [path("", views.converter, name="converter")]

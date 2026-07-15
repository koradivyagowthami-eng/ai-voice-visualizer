from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from portal import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("home/", views.home, name="home_page"),
    path("post-item/", views.post_item, name="post_item"),
    path("post_item/", views.post_item, name="post_item_old"),
    path("item/<int:item_id>/", views.item_detail, name="item_detail"),
    path("item/<int:item_id>/claim/", views.claim_item, name="claim_item"),
    path("claim/<int:item_id>/", views.claim_item, name="claim_item_old"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

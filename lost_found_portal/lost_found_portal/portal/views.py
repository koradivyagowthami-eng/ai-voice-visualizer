from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect, render

from .forms import ClaimRequestForm, ItemForm
from .models import Item


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("/home/")

        messages.error(request, "Invalid username or password.")

    return render(request, "registration/login.html")


def logout_view(request):
    logout(request)
    return redirect("/home/")


def home(request):
    query = request.GET.get("q", "").strip()
    item_type = request.GET.get("type", "").strip()
    items = Item.objects.all()

    if query:
        items = items.filter(name__icontains=query) | items.filter(location__icontains=query)

    if item_type in [Item.LOST, Item.FOUND]:
        items = items.filter(item_type=item_type)

    return render(
        request,
        "portal/home.html",
        {
            "items": items,
            "query": query,
            "selected_type": item_type,
        },
    )


def post_item(request):
    if request.method == "POST":
        form = ItemForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Item posted successfully.")
            return redirect("/home/")
    else:
        form = ItemForm()

    return render(request, "portal/post_item.html", {"form": form})


def item_detail(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    return render(request, "portal/item_detail.html", {"item": item})


def claim_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)

    if request.method == "POST":
        form = ClaimRequestForm(request.POST)
        if form.is_valid():
            claim = form.save(commit=False)
            claim.item = item
            claim.save()
            messages.success(request, "Claim request sent. Admin will verify the details.")
            return redirect("item_detail", item_id=item.id)
    else:
        form = ClaimRequestForm()

    return render(request, "portal/claim_item.html", {"form": form, "item": item})

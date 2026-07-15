from django.db import models


class Item(models.Model):
    LOST = "lost"
    FOUND = "found"
    ITEM_TYPE_CHOICES = [
        (LOST, "Lost"),
        (FOUND, "Found"),
    ]

    OPEN = "open"
    CLAIMED = "claimed"
    STATUS_CHOICES = [
        (OPEN, "Open"),
        (CLAIMED, "Claimed"),
    ]

    name = models.CharField(max_length=100)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPE_CHOICES)
    location = models.CharField(max_length=100)
    image = models.ImageField(upload_to="item_images/", blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=OPEN)
    posted_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-posted_on"]

    def __str__(self):
        return self.name


class ClaimRequest(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="claim_requests")
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    proof_message = models.TextField()
    is_verified = models.BooleanField(default=False)
    requested_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-requested_on"]

    def __str__(self):
        return f"{self.full_name} - {self.item.name}"

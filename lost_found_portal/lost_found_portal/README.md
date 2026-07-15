# Lost and Found Portal

A simple Django and Python mini project for a college seminar. Students can post lost or found items, search listed items, view item details, and submit a claim request. Admin users can verify requests through Django Admin.

## Features

- Post lost or found item details
- Search by item name or location
- Filter lost and found items
- Upload item image
- Send claim request with proof message
- Admin verification through Django Admin

## How to Run

```bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

Admin panel:

```text
http://127.0.0.1:8000/admin/
```

## Seminar Note

The Lost and Found Portal is a Django-based web application for college campuses. It allows students to report lost or found belongings, search posted items, and send claim requests. The admin verifies ownership details and can mark items as claimed.

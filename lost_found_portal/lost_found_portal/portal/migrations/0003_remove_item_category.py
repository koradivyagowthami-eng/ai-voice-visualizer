from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("portal", "0002_remove_old_item_columns"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="item",
            name="category",
        ),
    ]

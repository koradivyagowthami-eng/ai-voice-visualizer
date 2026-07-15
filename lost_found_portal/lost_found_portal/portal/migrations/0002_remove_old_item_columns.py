from django.db import migrations


def remove_old_columns(apps, schema_editor):
    table_name = "portal_item"
    old_columns = ["found_or_lost_date", "description"]

    with schema_editor.connection.cursor() as cursor:
        cursor.execute(f"PRAGMA table_info({table_name})")
        existing_columns = {row[1] for row in cursor.fetchall()}

        for column in old_columns:
            if column in existing_columns:
                cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN {column}")


class Migration(migrations.Migration):
    dependencies = [
        ("portal", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(remove_old_columns, migrations.RunPython.noop),
    ]

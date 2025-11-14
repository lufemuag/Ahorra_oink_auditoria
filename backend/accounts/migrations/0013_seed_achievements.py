from django.db import migrations

def seed(apps, schema_editor):
    Achievement = apps.get_model("accounts", "Achievement")
    data = [
        ("LOGIN", "Inicia sesión por primera vez", "login", 5),
        ("FIRST_INCOME", "Registra tu primer ingreso", "coin-in", 10),
        ("FIRST_EXPENSE", "Registra tu primer gasto", "coin-out", 10),
        ("FIRST_SETTINGS_CHANGE", "Guarda un cambio en Configuración", "settings", 5),
        ("SAVING_METHOD_SELECTED", "Selecciona tu método de ahorro", "piggy", 10),
    ]
    for code, desc, icon, points in data:
        Achievement.objects.get_or_create(
            name=code,
            defaults={
                "description": desc,
                "icon": icon,
                "points": points,
                "condition_type": code.lower(),
                "is_active": True,
            },
        )

def unseed(apps, schema_editor):
    Achievement = apps.get_model("accounts", "Achievement")
    Achievement.objects.filter(
        name__in=[
            "LOGIN",
            "FIRST_INCOME",
            "FIRST_EXPENSE",
            "FIRST_SETTINGS_CHANGE",
            "SAVING_METHOD_SELECTED",
        ]
    ).delete()

class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0012_category_is_default_category_user_and_more"),  
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]

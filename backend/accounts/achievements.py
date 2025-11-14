# backend/accounts/achievements.py
from .models import Achievement, UserAchievement

# 🔹 Códigos usados
ACH_LOGIN = "login"
ACH_FIRST_INCOME = "first_income"
ACH_FIRST_EXPENSE = "first_expense"
ACH_FIRST_SETTINGS_CHANGE = "first_settings_change"
ACH_SAVING_METHOD_SELECTED = "saving_method_selected"

def unlock(user, condition_type: str) -> bool:
    """
    Desbloquea el logro asociado a `condition_type` para el usuario dado.
    Retorna True si se acaba de desbloquear (nuevo), o False si ya estaba desbloqueado.
    """
    if not user or not getattr(user, "id", None):
        return False

    try:
        achievement = Achievement.objects.get(condition_type=condition_type, is_active=True)
    except Achievement.DoesNotExist:
        return False

    obj, created = UserAchievement.objects.get_or_create(user=user, achievement=achievement)
    return created  

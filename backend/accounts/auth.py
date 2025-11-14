# accounts/auth.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings
from django.utils.translation import gettext_lazy as _
from .models import Usuario

class UsuarioJWTAuthentication(JWTAuthentication):
    """
    Autenticación SimpleJWT que resuelve el usuario en la tabla accounts.Usuario
    usando el claim configurado (por defecto 'user_id').
    """

    def get_user(self, validated_token):
        # Lee el claim configurado (normalmente "user_id")
        user_id_claim = api_settings.USER_ID_CLAIM
        user_id = validated_token.get(user_id_claim)

        if not user_id:
            raise InvalidToken(_("Token inválido: no contiene %(claim)s.") % {"claim": user_id_claim})

        user = Usuario.objects.filter(pk=user_id).first()
        if not user:
            raise InvalidToken(_("Usuario no encontrado."))

        if hasattr(user, "is_active") and not user.is_active:
            raise InvalidToken(_("Usuario inactivo."))

        return user

# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password as django_validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
import re
from .models import Usuario

# ========= Registro =========
class RegisterUsuarioSerializer(serializers.Serializer):
    firstName = serializers.CharField(min_length=2)
    username  = serializers.EmailField()
    password  = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)  # 👈 mínimo 8

    def validate_username(self, value):
        correo = value.strip().lower()
        if Usuario.objects.filter(correo__iexact=correo).exists():
            raise serializers.ValidationError("El correo ya está registrado.")
        return correo  # 👈 devolvemos normalizado

    def validate_password(self, value):
        # Valida reglas de Django
        try:
            django_validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        # Regla adicional: mayúscula y minúscula
        if not re.search(r'(?=.*[a-z])(?=.*[A-Z])', value):
            raise serializers.ValidationError("Debe contener al menos una mayúscula y una minúscula.")
        return value

    def create(self, validated_data):
        nombre   = validated_data["firstName"].strip()
        correo   = validated_data["username"]            # ya viene normalizado
        password = validated_data["password"]
        try:
            with transaction.atomic():
                return Usuario.objects.create(
                    nombrecompleto=nombre,
                    correo=correo,
                    contraseniaencriptada=make_password(password)
                )
        except IntegrityError:
            # Unicidad por DB
            raise serializers.ValidationError({"username": "El correo ya está registrado."})

# ========= Login =========
class LoginUsuarioSerializer(serializers.Serializer):
    username = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get("username", "").strip().lower()
        pwd   = attrs.get("password")

        user = Usuario.objects.filter(correo__iexact=email).first()
        if not user or not check_password(pwd, user.contraseniaencriptada):
            raise serializers.ValidationError("Credenciales inválidas")

        attrs["user"] = user
        return attrs

# ========= Me / UpdateMe / ChangePassword =========
class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ("id", "nombrecompleto", "correo")

class UpdateMeSerializer(serializers.Serializer):
    nombrecompleto = serializers.CharField(required=False, min_length=2, allow_blank=False)
    correo = serializers.EmailField(required=False)

    def validate_correo(self, value):
        user = self.context["request"].user
        correo = value.strip().lower()
        if Usuario.objects.filter(correo__iexact=correo).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("El correo ya está registrado.")
        return correo

    def update(self, instance, validated_data):
        if "nombrecompleto" in validated_data:
            instance.nombrecompleto = validated_data["nombrecompleto"].strip()
        if "correo" in validated_data:
            instance.correo = validated_data["correo"].strip().lower()
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password     = serializers.CharField(write_only=True, trim_whitespace=False, min_length=8)  # 👈 mínimo 8

    def validate(self, attrs):
        user = self.context["request"].user
        current = attrs.get("current_password")
        new     = attrs.get("new_password")

        if not check_password(current, user.contraseniaencriptada):
            raise serializers.ValidationError({"current_password": "La contraseña actual es incorrecta."})

        try:
            django_validate_password(new, user=user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        if not re.search(r'(?=.*[a-z])(?=.*[A-Z])', new):
            raise serializers.ValidationError({"new_password":"Debe contener al menos una mayúscula y una minúscula."})

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        new  = self.validated_data["new_password"]
        user.contraseniaencriptada = make_password(new)
        user.save()
        return user

# ========= Método de Ahorro =========
class UpdateSavingsMethodSerializer(serializers.Serializer):
    method = serializers.ChoiceField(choices=[
        ('50-30-20', 'Método 50:30:20'),
        ('sobres', 'Método de Sobres'),
        ('automatico', 'Ahorro Automático'),
        ('1dolar', 'Ahorro del $1'),
        ('redondeo', 'Método del Redondeo'),
    ])
    monthly_income = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)

    def update(self, instance, validated_data):
        instance.selected_savings_method = validated_data['method']
        instance.monthly_income = validated_data['monthly_income']
        instance.save()
        return instance
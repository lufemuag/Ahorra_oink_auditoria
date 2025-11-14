# accounts/settings_serializers.py
from rest_framework import serializers
from .models import UserSettings

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'id', 'currency', 'theme', 'notifications_enabled', 
            'email_notifications', 'monthly_budget_limit', 
            'savings_goal_reminder', 'transaction_reminder', 
            'language', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Crear configuraciones por defecto para un usuario
        return UserSettings.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Actualizar configuraciones existentes
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

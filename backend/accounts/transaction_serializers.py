from rest_framework import serializers
from django.db import models
from .models import Transaction, Category, SavingsGoal, Achievement, UserAchievement
from decimal import Decimal

# ========= SERIALIZERS DE TRANSACCIONES =========

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer para transacciones"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'category', 'category_name', 'type', 'amount', 
            'description', 'date', 'created_at', 'updated_at'
        ]
    
    def validate_amount(self, value):
        """Validar que el monto sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0")
        
        if value > Decimal('1000000000.00'):
            raise serializers.ValidationError("El monto no puede exceder 1 billón")
        
        return value
    
    def validate_description(self, value):
        """Validar descripción"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("La descripción no puede estar vacía")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("La descripción debe tener al menos 3 caracteres")
        
        return value.strip()
    
    def create(self, validated_data):
        """Crear transacción con manejo de categoría"""
        category_name = validated_data.pop('category', None)
        category_obj = None
        user = validated_data.get('user')
        
        if category_name and user:
            try:
                # Buscar categoría del usuario o categoría predeterminada
                category_obj = Category.objects.filter(
                    models.Q(user=user, name=category_name) | 
                    models.Q(is_default=True, user__isnull=True, name=category_name)
                ).first()
            except Exception:
                pass
            
            # Si no existe, crear nueva categoría para el usuario
            if not category_obj:
                category_obj = Category.objects.create(
                    user=user,
                    name=category_name,
                    description=f"Categoría: {category_name}",
                    color="#007bff"
                )
        
        validated_data['category'] = category_obj
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Actualizar transacción con manejo de categoría"""
        category_name = validated_data.pop('category', None)
        category_obj = None
        user = instance.user
        
        if category_name and user:
            try:
                # Buscar categoría del usuario o categoría predeterminada
                category_obj = Category.objects.filter(
                    models.Q(user=user, name=category_name) | 
                    models.Q(is_default=True, user__isnull=True, name=category_name)
                ).first()
            except Exception:
                pass
            
            # Si no existe, crear nueva categoría para el usuario
            if not category_obj:
                category_obj = Category.objects.create(
                    user=user,
                    name=category_name,
                    description=f"Categoría: {category_name}",
                    color="#007bff"
                )
        
        if category_obj is not None:
            validated_data['category'] = category_obj
        
        return super().update(instance, validated_data)
    

# ========= SERIALIZERS DE CATEGORÍAS =========

class CategorySerializer(serializers.ModelSerializer):
    """Serializer para categorías"""
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'color', 'icon',
            'created_at', 'updated_at'
        ]
    
    def validate_name(self, value):
        """Validar nombre de categoría"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("El nombre no puede estar vacío")
        
        if len(value.strip()) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres")
        
        return value.strip()

# ========= SERIALIZERS DE METAS DE AHORRO =========

class SavingsGoalSerializer(serializers.ModelSerializer):
    """Serializer para metas de ahorro"""
    
    class Meta:
        model = SavingsGoal
        fields = [
            'id', 'user', 'name', 'description', 'target_amount',
            'current_amount', 'target_date', 'is_completed',
            'progress_percentage', 'created_at', 'updated_at'
        ]
    
    def validate_target_amount(self, value):
        """Validar monto objetivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto objetivo debe ser mayor a 0")
        
        if value > Decimal('1000000000.00'):
            raise serializers.ValidationError("El monto objetivo no puede exceder 1 billón")
        
        return value
    
    def validate_current_amount(self, value):
        """Validar monto actual"""
        if value < 0:
            raise serializers.ValidationError("El monto actual no puede ser negativo")
        
        if value > Decimal('1000000000.00'):
            raise serializers.ValidationError("El monto actual no puede exceder 1 billón")
        
        return value
    
    def validate_name(self, value):
        """Validar nombre de meta"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("El nombre no puede estar vacío")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        
        return value.strip()

# ========= SERIALIZERS DE LOGROS =========

class AchievementSerializer(serializers.ModelSerializer):
    """Serializer para logros"""
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon', 'points',
            'condition_type', 'condition_value', 'is_active', 'created_at'
        ]
    
    def validate_name(self, value):
        """Validar nombre de logro"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("El nombre no puede estar vacío")
        
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        
        return value.strip()

class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer para logros de usuario"""
    
    achievement = AchievementSerializer(read_only=True)
    achievement_id = serializers.PrimaryKeyRelatedField(
        queryset=Achievement.objects.all(), 
        source='achievement',
        write_only=True
    )
    
    class Meta:
        model = UserAchievement
        fields = [
            'id', 'user', 'achievement', 'achievement_id', 'unlocked_at'
        ]


# ========= NUEVO: LOGROS CON ESTADO PARA /achievements =========

class AchievementWithStatusSerializer(serializers.ModelSerializer):
    """Serializer de logros con estado desbloqueado/bloqueado para el usuario actual"""
    unlocked = serializers.SerializerMethodField()
    unlocked_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = (
            'id',
            'name',
            'description',
            'icon',
            'points',
            'condition_type',
            'condition_value',
            'is_active',
            'unlocked',
            'unlocked_at',
        )

    def get_unlocked(self, obj):
        user = self.context.get('request').user
        return UserAchievement.objects.filter(user=user, achievement=obj).exists()

    def get_unlocked_at(self, obj):
        user = self.context.get('request').user
        ua = UserAchievement.objects.filter(user=user, achievement=obj).only('unlocked_at').first()
        return ua.unlocked_at if ua else None

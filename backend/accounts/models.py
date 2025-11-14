# accounts/models.py
from typing import ClassVar
from django.db import models
from django.db.models.manager import BaseManager
from django.contrib.auth.models import User
from django.utils import timezone

class Usuario(models.Model):
    objects: ClassVar[BaseManager["Usuario"]] = models.Manager()

    id = models.AutoField(db_column='Id', primary_key=True)
    nombrecompleto = models.CharField(db_column='NombreCompleto', max_length=100)
    correo = models.CharField(db_column='Correo', unique=True, max_length=100)
    contraseniaencriptada = models.CharField(db_column='ContraseniaEncriptada', max_length=255)
    
    # Campos para método de ahorro seleccionado
    selected_savings_method = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        db_column='SelectedSavingsMethod',
        choices=[
            ('50-30-20', 'Método 50:30:20'),
            ('sobres', 'Método de Sobres'),
            ('automatico', 'Ahorro Automático'),
            ('1dolar', 'Ahorro del $1'),
            ('redondeo', 'Método del Redondeo'),
        ]
    )
    savings_method_selected_at = models.DateTimeField(
        null=True,
        blank=True,
        db_column='SavingsMethodSelectedAt',
        help_text='Fecha en que el usuario seleccionó su método de ahorro'
    )
    monthly_income = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        db_column='MonthlyIncome'
    )
    
    # Balance actual del usuario
    current_balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        db_column='CurrentBalance',
        help_text='Saldo actual del usuario. Se actualiza al crear transacciones.'
    )
    
    # Campos para soft delete
    is_deleted = models.BooleanField(default=False, db_column='IsDeleted')
    deleted_at = models.DateTimeField(null=True, blank=True, db_column='DeletedAt')
    deleted_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='deleted_users', db_column='DeletedBy')
    deletion_reason = models.TextField(blank=True, null=True, db_column='DeletionReason')

    
    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_active(self) -> bool:
        return not self.is_deleted

    def soft_delete(self, deleted_by=None, reason=None):
        """Eliminar usuario de forma suave (soft delete)"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = deleted_by
        self.deletion_reason = reason
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by', 'deletion_reason'])

    def restore(self):
        """Restaurar usuario eliminado"""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.deletion_reason = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by', 'deletion_reason'])
    
    def can_change_savings_method(self):
        """Verificar si el usuario puede cambiar su método de ahorro (15 días desde la última selección)"""
        if not self.savings_method_selected_at:
            return True  # Nunca ha seleccionado un método, puede elegir
        
        days_since_selection = (timezone.now() - self.savings_method_selected_at).days
        return days_since_selection >= 15
    
    def days_until_can_change_method(self):
        """Obtener cuántos días faltan para poder cambiar el método de ahorro"""
        if not self.savings_method_selected_at:
            return 0  # Puede cambiar inmediatamente
        
        days_since_selection = (timezone.now() - self.savings_method_selected_at).days
        days_remaining = 15 - days_since_selection
        return max(0, days_remaining)

    class Meta:
        managed = True
        db_table = 'Usuario'

# ========= MODELOS NUEVOS =========

class Category(models.Model):
    """Categorías para transacciones (alimentación, transporte, etc.)"""
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default='#007bff')  # Color hex para UI
    icon = models.CharField(max_length=50, blank=True, null=True)  # Nombre del icono
    is_default = models.BooleanField(default=False)  # Categorías predeterminadas del sistema
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        unique_together = [['user', 'name']]  # Nombre único por usuario

    def __str__(self):
        return f"{self.name} ({self.user.nombrecompleto if self.user else 'Global'})"

class Transaction(models.Model):
    """Transacciones (ingresos, gastos y ahorros)"""
    TRANSACTION_TYPES = [
        ('income', 'Ingreso'),
        ('expense', 'Gasto'),
        ('savings', 'Ahorro'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.CharField(max_length=255)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'transactions'
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.get_type_display()}: ${self.amount} - {self.description}"

class SavingsGoal(models.Model):
    """Metas de ahorro de los usuarios"""
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='savings_goals')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    target_amount = models.DecimalField(max_digits=15, decimal_places=2)
    current_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    target_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'savings_goals'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name}: ${self.current_amount}/${self.target_amount}"

    @property
    def progress_percentage(self):
        if self.target_amount > 0:
            return (self.current_amount / self.target_amount) * 100
        return 0

class Achievement(models.Model):
    """Logros/achievements del sistema"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, null=True)
    points = models.IntegerField(default=10)
    condition_type = models.CharField(max_length=50)  # 'first_transaction', 'savings_milestone', etc.
    condition_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'achievements'
        ordering = ['points']

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    """Logros desbloqueados por usuarios"""
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='user_achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'user_achievements'
        unique_together = ['user', 'achievement']
        ordering = ['-unlocked_at']

    def __str__(self):
        return f"{self.user.nombrecompleto} - {self.achievement.name}"

class Notification(models.Model):
    """Notificaciones del sistema"""
    NOTIFICATION_TYPES = [
        ('info', 'Información'),
        ('warning', 'Advertencia'),
        ('success', 'Éxito'),
        ('error', 'Error'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.nombrecompleto}"

    def mark_as_read(self):
        from django.utils import timezone
        self.is_read = True
        self.read_at = timezone.now()
        self.save()

class UserSettings(models.Model):
    """Configuraciones personalizadas por usuario"""
    CURRENCY_CHOICES = [
        ('COP', 'Peso Colombiano (COP)'),
        ('USD', 'Dólar Americano (USD)'),
        ('EUR', 'Euro (EUR)'),
    ]
    
    THEME_CHOICES = [
        ('light', 'Claro'),
        ('dark', 'Oscuro'),
        ('auto', 'Automático'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='settings')
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='COP')
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    notifications_enabled = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    monthly_budget_limit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    savings_goal_reminder = models.BooleanField(default=True)
    transaction_reminder = models.BooleanField(default=False)
    language = models.CharField(max_length=5, default='es')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'user_settings'
        verbose_name = 'Configuración de Usuario'
        verbose_name_plural = 'Configuraciones de Usuario'

    def __str__(self):
        return f"Configuración de {self.user.nombrecompleto}"

from django.contrib import admin
from .models import (
    Usuario, Category, Transaction, SavingsGoal,
    Achievement, UserAchievement, Notification, UserSettings
)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombrecompleto', 'correo', 'is_deleted', 'deleted_at', 'get_transaction_count', 'get_savings_goals_count', 'get_total_balance')
    list_filter = ('is_deleted', 'deleted_at', 'correo')
    search_fields = ('nombrecompleto', 'correo')
    readonly_fields = ('id', 'deleted_at', 'deleted_by', 'get_transaction_count', 'get_savings_goals_count', 'get_total_balance')
    fieldsets = (
        ('Información Personal', {
            'fields': ('id', 'nombrecompleto', 'correo', 'contraseniaencriptada')
        }),
        ('Estado de Eliminación', {
            'fields': ('is_deleted', 'deleted_at', 'deleted_by', 'deletion_reason'),
            'classes': ('collapse',)
        }),
        ('Estadísticas', {
            'fields': ('get_transaction_count', 'get_savings_goals_count', 'get_total_balance'),
            'classes': ('collapse',)
        }),
    )

    actions = ['restore_users', 'soft_delete_users']

    def get_transaction_count(self, obj):
        return obj.transactions.count()
    get_transaction_count.short_description = 'Total Transacciones'

    def get_savings_goals_count(self, obj):
        return obj.savings_goals.count()
    get_savings_goals_count.short_description = 'Metas de Ahorro'

    def get_total_balance(self, obj):
        from django.db.models import Sum
        total_income = obj.transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = obj.transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        total_savings = obj.transactions.filter(type='savings').aggregate(Sum('amount'))['amount__sum'] or 0
        balance = total_income - total_expense + total_savings
        return f"${balance:,.2f}"
    get_total_balance.short_description = 'Balance Total'

    def restore_users(self, request, queryset):
        """Restaurar usuarios seleccionados"""
        restored_count = 0
        for user in queryset.filter(is_deleted=True):
            user.restore()
            restored_count += 1
        self.message_user(request, f'{restored_count} usuarios restaurados exitosamente.')
    restore_users.short_description = "Restaurar usuarios seleccionados"

    def soft_delete_users(self, request, queryset):
        """Eliminar usuarios seleccionados de forma suave"""
        deleted_count = 0
        for user in queryset.filter(is_deleted=False):
            user.soft_delete(deleted_by=request.user, reason='Eliminado desde admin')
            deleted_count += 1
        self.message_user(request, f'{deleted_count} usuarios eliminados exitosamente.')
    soft_delete_users.short_description = "Eliminar usuarios seleccionados (soft delete)"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'color', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'type', 'amount', 'category', 'date', 'description', 'created_at')
    list_filter = ('type', 'category', 'date', 'created_at', 'user')
    search_fields = ('description', 'user__nombrecompleto', 'user__correo')
    readonly_fields = ('id', 'created_at', 'updated_at')
    date_hierarchy = 'date'
    list_per_page = 50
    ordering = ('-created_at',)

    fieldsets = (
        ('Información de la Transacción', {
            'fields': ('id', 'user', 'type', 'amount', 'description', 'date')
        }),
        ('Categorización', {
            'fields': ('category',)
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """Mostrar todas las transacciones de todos los usuarios para administradores"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'category')


@admin.register(SavingsGoal)
class SavingsGoalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'current_amount', 'target_amount', 'target_date', 'is_completed')
    list_filter = ('is_completed', 'target_date', 'created_at')
    search_fields = ('name', 'user__nombrecompleto')
    readonly_fields = ('id', 'created_at', 'updated_at', 'progress_percentage')
    date_hierarchy = 'target_date'


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    # columnas visibles
    list_display = ('id', 'name', 'points', 'condition_type', 'is_active', 'created_at')
    # fuerza que el link sea el nombre
    list_display_links = ('name',)
    list_filter = ('is_active', 'condition_type', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at')
    ordering = ('id',)

    # campos del formulario (aseguramos que sean editables)
    fields = (
        'name',
        'description',
        'icon',
        'points',
        'condition_type',
        'condition_value',
        'is_active',
        'created_at',
        'id',
    )


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'achievement', 'unlocked_at')
    list_filter = ('unlocked_at', 'achievement')
    search_fields = ('user__nombrecompleto', 'achievement__name')
    readonly_fields = ('id', 'unlocked_at')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__nombrecompleto')
    readonly_fields = ('id', 'created_at', 'read_at')
    date_hierarchy = 'created_at'


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'currency', 'theme', 'notifications_enabled', 'monthly_budget_limit')
    list_filter = ('currency', 'theme', 'notifications_enabled', 'email_notifications', 'language')
    search_fields = ('user__nombrecompleto', 'user__correo')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Preferencias', {
            'fields': ('currency', 'theme', 'language')
        }),
        ('Notificaciones', {
            'fields': ('notifications_enabled', 'email_notifications', 'savings_goal_reminder', 'transaction_reminder')
        }),
        ('Límites', {
            'fields': ('monthly_budget_limit',)
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

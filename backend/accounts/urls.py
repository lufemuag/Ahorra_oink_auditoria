# accounts/urls.py
from django.urls import path
from .views import (
    RegisterUsuarioView,
    LoginView,
    MeView,
    MeDetailView,
    ChangePasswordView,
    SetInitialBalanceView,
    DeleteAccountView,
    UpdateSavingsMethodView,
)
from .transaction_views import (
    TransactionListView,
    TransactionDetailView,
    CategoryListView,
    SavingsGoalListView,
    SavingsGoalDetailView,
    AchievementListView,
    UserAchievementListView,
    get_statistics,
)
from .settings_views import UserSettingsView
from .admin_views import AdminDashboardView, AdminUsersView, AdminUserDetailView
from .recovery_views import DeletedUsersView, RestoreUserView, SoftDeleteUserView, PermanentDeleteUserView

urlpatterns = [
    # Autenticación
    path('register/',                 RegisterUsuarioView.as_view(), name='register'),
    path('auth/login/',              LoginView.as_view(),           name='login'),
    path('auth/me/',                 MeView.as_view(),              name='me'),
    path('auth/me/detail/',          MeDetailView.as_view(),        name='me-detail'),
    path('auth/me/change-password/', ChangePasswordView.as_view(),  name='change-password'),
    path('auth/me/set-initial-balance/', SetInitialBalanceView.as_view(), name='set-initial-balance'),
    path('auth/me/delete-account/',  DeleteAccountView.as_view(),   name='delete-account'),
    path('auth/me/savings-method/',  UpdateSavingsMethodView.as_view(), name='savings-method'),
    
    # Transacciones
    path('transactions/',            TransactionListView.as_view(), name='transactions'),
    path('transactions/<int:pk>/',   TransactionDetailView.as_view(), name='transaction-detail'),
    
    # Categorías
    path('categories/',              CategoryListView.as_view(), name='categories'),
    
    # Metas de ahorro
    path('savings-goals/',           SavingsGoalListView.as_view(), name='savings-goals'),
    path('savings-goals/<int:pk>/',  SavingsGoalDetailView.as_view(), name='savings-goal-detail'),
    
    # Logros
    path('achievements/',            AchievementListView.as_view(), name='achievements'),
    path('user-achievements/',       UserAchievementListView.as_view(), name='user-achievements'),
    
    # Estadísticas
    path('statistics/',              get_statistics, name='statistics'),
    
    # Configuraciones de usuario
    path('settings/',                UserSettingsView.as_view(), name='user-settings'),
    
    # Vistas de administrador
    path('admin/dashboard/',         AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/users/',             AdminUsersView.as_view(), name='admin-users'),
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    
    # Sistema de recuperación de cuentas
    path('admin/deleted-users/',     DeletedUsersView.as_view(), name='deleted-users'),
    path('admin/restore-user/<int:user_id>/', RestoreUserView.as_view(), name='restore-user'),
    path('admin/soft-delete-user/<int:user_id>/', SoftDeleteUserView.as_view(), name='soft-delete-user'),
    path('admin/permanent-delete-user/<int:user_id>/', PermanentDeleteUserView.as_view(), name='permanent-delete-user'),
]

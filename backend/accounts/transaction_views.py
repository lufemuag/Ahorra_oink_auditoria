# accounts/transaction_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db import models
from django.utils import timezone
from decimal import Decimal
import logging

from .models import Transaction, Category, SavingsGoal, Achievement, UserAchievement
from .transaction_serializers import (
    TransactionSerializer,
    CategorySerializer,
    SavingsGoalSerializer,
    AchievementSerializer,
    UserAchievementSerializer,
)

# 👇 si usas helpers de logros:
try:
    from .achievements import unlock, ACH_FIRST_INCOME, ACH_FIRST_EXPENSE
except Exception:
    # si aún no están, no bloquear el import
    def unlock(*args, **kwargs): 
        return
    ACH_FIRST_INCOME = "FIRST_INCOME"
    ACH_FIRST_EXPENSE = "FIRST_EXPENSE"

logger = logging.getLogger('security')

# ========= TRANSACCIONES =========

class TransactionListView(APIView):
    """Lista y crea transacciones del usuario"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Transaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = TransactionSerializer(qs, many=True)
        
        # Log para debugging
        print(f"Usuario: {request.user.id} - Transacciones encontradas: {qs.count()}")
        for tx in qs:
            print(f"  - ID: {tx.id}, Tipo: {tx.type}, Monto: {tx.amount}, Fecha: {tx.date}")
        
        return Response({'success': True, 'transactions': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        # Validaciones rápidas
        if 'amount' in data:
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    return Response({'success': False, 'errors': {'amount': ['El monto debe ser mayor a 0']}}, status=status.HTTP_400_BAD_REQUEST)
                if amount > 1_000_000_000:
                    return Response({'success': False, 'errors': {'amount': ['El monto no puede exceder 1 billón']}}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({'success': False, 'errors': {'amount': ['El monto debe ser un número válido']}}, status=status.HTTP_400_BAD_REQUEST)

        if 'date' not in data or not data['date']:
            data['date'] = timezone.now().date()

        serializer = TransactionSerializer(data=data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        tx = serializer.save(user=request.user)
        
        # Log para debugging
        print(f"Transacción creada - Usuario: {request.user.id}, ID: {tx.id}, Tipo: {tx.type}, Monto: {tx.amount}, Fecha: {tx.date}")

        # Actualiza balance
        user = request.user
        if tx.type == 'income':
            user.current_balance += Decimal(str(tx.amount))
        elif tx.type == 'expense':
            user.current_balance -= Decimal(str(tx.amount))
        elif tx.type == 'savings':
            # Los ahorros NO se restan del balance disponible
            # Se mantienen como ahorros separados
            pass
        user.save(update_fields=['current_balance'])
        
        print(f"Balance actualizado - Usuario: {request.user.id}, Nuevo balance: {user.current_balance}")

        # Desbloqueos básicos
        try:
            if tx.type == 'income':
                unlock(request.user, ACH_FIRST_INCOME)
            elif tx.type == 'expense':
                unlock(request.user, ACH_FIRST_EXPENSE)
        except Exception:
            pass

        logger.info(f"Transacción creada - u:{request.user.id} t:{tx.type} m:{tx.amount} bal:{user.current_balance}")

        return Response({'success': True, 'transaction': TransactionSerializer(tx).data}, status=status.HTTP_201_CREATED)


class TransactionDetailView(APIView):
    """Detalle/edición/eliminación de transacción"""
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Transaction, pk=pk, user=user)

    def get(self, request, pk):
        tx = self.get_object(pk, request.user)
        return Response({'success': True, 'transaction': TransactionSerializer(tx).data}, status=status.HTTP_200_OK)

    def put(self, request, pk):
        tx = self.get_object(pk, request.user)

        if 'amount' in request.data:
            try:
                amount = float(request.data['amount'])
                if amount <= 0:
                    return Response({'success': False, 'errors': {'amount': ['El monto debe ser mayor a 0']}}, status=status.HTTP_400_BAD_REQUEST)
                if amount > 1_000_000_000:
                    return Response({'success': False, 'errors': {'amount': ['El monto no puede exceder 1 billón']}}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, TypeError):
                return Response({'success': False, 'errors': {'amount': ['El monto debe ser un número válido']}}, status=status.HTTP_400_BAD_REQUEST)

        old_type, old_amount = tx.type, tx.amount
        serializer = TransactionSerializer(tx, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        txu = serializer.save()

        # Ajuste de balance solo si cambió tipo/monto
        user = request.user
        if old_type != txu.type or old_amount != txu.amount:
            # Revertir el efecto de la transacción anterior
            if old_type == 'income':
                user.current_balance -= Decimal(str(old_amount))
            elif old_type == 'expense':
                user.current_balance += Decimal(str(old_amount))
            # Los ahorros no afectan el balance disponible
            
            # Aplicar el efecto de la nueva transacción
            if txu.type == 'income':
                user.current_balance += Decimal(str(txu.amount))
            elif txu.type == 'expense':
                user.current_balance -= Decimal(str(txu.amount))
            # Los ahorros no afectan el balance disponible
            
            user.save(update_fields=['current_balance'])

        logger.info(f"Transacción actualizada - u:{request.user.id} id:{pk} bal:{user.current_balance}")

        return Response({'success': True, 'transaction': TransactionSerializer(txu).data}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        tx = self.get_object(pk, request.user)
        user = request.user
        
        # Revertir el efecto de la transacción en el balance
        if tx.type == 'income':
            user.current_balance -= Decimal(str(tx.amount))
            user.save(update_fields=['current_balance'])
            logger.info(f"Transacción eliminada (INGRESO) - u:{request.user.id} id:{pk} bal:{user.current_balance}")
        elif tx.type == 'expense':
            user.current_balance += Decimal(str(tx.amount))
            user.save(update_fields=['current_balance'])
            logger.info(f"Transacción eliminada (GASTO) - u:{request.user.id} id:{pk} bal:{user.current_balance}")
        else:  # savings
            logger.info(f"Transacción eliminada (AHORRO) - u:{request.user.id} id:{pk} bal no modificado")
        
        tx.delete()
        return Response({'success': True, 'message': 'Transacción eliminada correctamente'}, status=status.HTTP_200_OK)

# ========= CATEGORÍAS =========

class CategoryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Category.objects.filter(models.Q(user=request.user) | models.Q(is_default=True, user__isnull=True))
        serializer = CategorySerializer(qs, many=True)
        return Response({'success': True, 'categories': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = CategorySerializer(data=data)
        if serializer.is_valid():
            category = serializer.save(user=request.user)
            return Response({'success': True, 'category': CategorySerializer(category).data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# ========= METAS DE AHORRO =========

class SavingsGoalListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = SavingsGoal.objects.filter(user=request.user).order_by('-created_at')
        serializer = SavingsGoalSerializer(qs, many=True)
        return Response({'success': True, 'savings_goals': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = SavingsGoalSerializer(data=data)
        if serializer.is_valid():
            goal = serializer.save(user=request.user)
            logger.info(f"Meta creada - u:{request.user.id} nombre:{goal.name}")
            return Response({'success': True, 'savings_goal': SavingsGoalSerializer(goal).data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class SavingsGoalDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(SavingsGoal, pk=pk, user=user)

    def get(self, request, pk):
        goal = self.get_object(pk, request.user)
        return Response({'success': True, 'savings_goal': SavingsGoalSerializer(goal).data}, status=status.HTTP_200_OK)

    def put(self, request, pk):
        goal = self.get_object(pk, request.user)
        serializer = SavingsGoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            logger.info(f"Meta actualizada - u:{request.user.id} id:{pk}")
            return Response({'success': True, 'savings_goal': SavingsGoalSerializer(updated).data}, status=status.HTTP_200_OK)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        goal = self.get_object(pk, request.user)
        logger.info(f"Meta eliminada - u:{request.user.id} id:{pk}")
        goal.delete()
        return Response({'success': True, 'message': 'Meta de ahorro eliminada correctamente'}, status=status.HTTP_200_OK)

# ========= LOGROS =========

class AchievementListView(APIView):
    """Catálogo de logros + estado del usuario actual"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        achievements = Achievement.objects.filter(is_active=True).order_by('id')
        ua = UserAchievement.objects.filter(user=request.user, achievement__in=achievements).select_related('achievement')
        ua_map = {x.achievement_id: x.unlocked_at for x in ua}

        items = []
        for a in achievements:
            base = AchievementSerializer(a).data
            unlocked_at = ua_map.get(a.id)
            if unlocked_at:
                base['unlocked'] = True
                base['unlocked_at'] = timezone.localtime(unlocked_at).isoformat()
            else:
                base['unlocked'] = False
                base['unlocked_at'] = None
            items.append(base)

        return Response({'success': True, 'achievements': items}, status=status.HTTP_200_OK)

class UserAchievementListView(APIView):
    """Lista de logros desbloqueados del usuario actual"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        ua = UserAchievement.objects.filter(user=request.user).select_related('achievement').order_by('-unlocked_at')
        serializer = UserAchievementSerializer(ua, many=True)
        return Response({'success': True, 'user_achievements': serializer.data}, status=status.HTTP_200_OK)

# ========= ESTADÍSTICAS =========

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_statistics(request):
    user = request.user
    total_transactions = Transaction.objects.filter(user=user).count()
    total_income = Transaction.objects.filter(user=user, type='income').aggregate(total=models.Sum('amount'))['total'] or 0
    total_expense = Transaction.objects.filter(user=user, type='expense').aggregate(total=models.Sum('amount'))['total'] or 0
    total_savings_transactions = Transaction.objects.filter(user=user, type='savings').aggregate(total=models.Sum('amount'))['total'] or 0
    total_savings = total_savings_transactions
    active_goals = SavingsGoal.objects.filter(user=user, is_completed=False).count()
    completed_goals = SavingsGoal.objects.filter(user=user, is_completed=True).count()
    user_achievements = UserAchievement.objects.filter(user=user).count()

    return Response({
        'success': True,
        'statistics': {
            'total_transactions': total_transactions,
            'total_income': float(total_income),
            'total_expense': float(total_expense),
            'total_savings': float(total_savings),
            'active_goals': active_goals,
            'completed_goals': completed_goals,
            'achievements': user_achievements,
            'balance': float(user.current_balance),
        }
    }, status=status.HTTP_200_OK)

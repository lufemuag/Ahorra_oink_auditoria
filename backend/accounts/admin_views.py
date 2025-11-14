# accounts/admin_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Usuario, Transaction, SavingsGoal, Category
from .serializers import MeSerializer
import logging

logger = logging.getLogger('security')

class AdminDashboardView(APIView):
    """Vista para el dashboard de administrador"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Obtener estadísticas globales del sistema"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Estadísticas de usuarios
            total_users = Usuario.objects.count()
            active_users = Usuario.objects.filter(
                transactions__created_at__gte=timezone.now() - timedelta(days=30)
            ).distinct().count()

            # Estadísticas de transacciones
            total_transactions = Transaction.objects.count()
            
            # Calcular totales de manera más simple
            income_transactions = Transaction.objects.filter(type='income')
            expense_transactions = Transaction.objects.filter(type='expense')
            savings_transactions = Transaction.objects.filter(type='savings')
            
            total_income = sum(tx.amount for tx in income_transactions)
            total_expense = sum(tx.amount for tx in expense_transactions)
            total_savings = sum(tx.amount for tx in savings_transactions)

            # Transacciones por tipo (simplificado)
            transactions_by_type = []
            for tx_type in ['income', 'expense', 'savings']:
                count = Transaction.objects.filter(type=tx_type).count()
                total = sum(tx.amount for tx in Transaction.objects.filter(type=tx_type))
                transactions_by_type.append({
                    'type': tx_type,
                    'count': count,
                    'total': float(total)
                })

            # Top categorías (simplificado)
            top_categories = []
            for category in Category.objects.all()[:10]:
                count = Transaction.objects.filter(category=category).count()
                top_categories.append({
                    'id': category.id,
                    'name': category.name,
                    'count': count
                })

            # Usuarios más activos (simplificado)
            top_users = []
            for user in Usuario.objects.all()[:10]:
                count = Transaction.objects.filter(user=user).count()
                top_users.append({
                    'id': user.id,
                    'name': user.nombrecompleto,
                    'email': user.correo,
                    'transactions': count
                })

            # Estadísticas por mes (simplificado)
            monthly_stats = []
            for i in range(6):
                month_start = timezone.now() - timedelta(days=30*(i+1))
                month_end = timezone.now() - timedelta(days=30*i)
                
                month_transactions = Transaction.objects.filter(
                    created_at__gte=month_start,
                    created_at__lt=month_end
                )
                
                income = sum(tx.amount for tx in month_transactions.filter(type='income'))
                expense = sum(tx.amount for tx in month_transactions.filter(type='expense'))
                savings = sum(tx.amount for tx in month_transactions.filter(type='savings'))
                
                monthly_stats.append({
                    'month': month_start.strftime('%Y-%m'),
                    'transactions': month_transactions.count(),
                    'income': float(income),
                    'expense': float(expense),
                    'savings': float(savings)
                })

            return Response({
                'success': True,
                'statistics': {
                    'users': {
                        'total': total_users,
                        'active': active_users
                    },
                    'transactions': {
                        'total': total_transactions,
                        'income': float(total_income),
                        'expense': float(total_expense),
                        'savings': float(total_savings),
                        'balance': float(total_income - total_expense + total_savings)
                    },
                    'by_type': transactions_by_type,
                    'top_categories': top_categories,
                    'top_users': top_users,
                    'monthly_stats': monthly_stats
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error en dashboard admin - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al obtener estadísticas'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminUsersView(APIView):
    """Vista para gestionar usuarios como administrador"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Obtener lista de todos los usuarios con estadísticas"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            users = Usuario.objects.all()
            users_data = []
            
            for user in users:
                # Calcular estadísticas del usuario
                user_transactions = Transaction.objects.filter(user=user)
                transaction_count = user_transactions.count()
                
                total_income = sum(tx.amount for tx in user_transactions.filter(type='income'))
                total_expense = sum(tx.amount for tx in user_transactions.filter(type='expense'))
                total_savings = sum(tx.amount for tx in user_transactions.filter(type='savings'))
                balance = total_income - total_expense + total_savings
                
                savings_goals_count = SavingsGoal.objects.filter(user=user).count()
                
                users_data.append({
                    'id': user.id,
                    'nombrecompleto': user.nombrecompleto,
                    'correo': user.correo,
                    'transaction_count': transaction_count,
                    'total_income': float(total_income),
                    'total_expense': float(total_expense),
                    'total_savings': float(total_savings),
                    'balance': float(balance),
                    'savings_goals_count': savings_goals_count
                })
            
            # Ordenar por número de transacciones
            users_data.sort(key=lambda x: x['transaction_count'], reverse=True)

            return Response({
                'success': True,
                'users': users_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error obteniendo usuarios admin - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al obtener usuarios'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminUserDetailView(APIView):
    """Vista para ver detalles de un usuario específico"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        """Obtener detalles completos de un usuario"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            user = Usuario.objects.get(id=user_id)
            
            # Obtener transacciones del usuario
            transactions = Transaction.objects.filter(user=user).order_by('-created_at')[:50]
            
            # Obtener metas de ahorro
            savings_goals = SavingsGoal.objects.filter(user=user).order_by('-created_at')
            
            # Estadísticas del usuario
            stats = Transaction.objects.filter(user=user).aggregate(
                total_transactions=Count('id'),
                total_income=Sum('amount', filter={'type': 'income'}),
                total_expense=Sum('amount', filter={'type': 'expense'}),
                total_savings=Sum('amount', filter={'type': 'savings'})
            )

            balance = (stats['total_income'] or 0) - (stats['total_expense'] or 0) + (stats['total_savings'] or 0)

            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'nombrecompleto': user.nombrecompleto,
                    'correo': user.correo,
                    'statistics': {
                        'total_transactions': stats['total_transactions'],
                        'total_income': float(stats['total_income'] or 0),
                        'total_expense': float(stats['total_expense'] or 0),
                        'total_savings': float(stats['total_savings'] or 0),
                        'balance': float(balance)
                    },
                    'recent_transactions': [
                        {
                            'id': tx.id,
                            'type': tx.type,
                            'amount': float(tx.amount),
                            'description': tx.description,
                            'category': tx.category.name if tx.category else None,
                            'date': tx.date,
                            'created_at': tx.created_at
                        } for tx in transactions
                    ],
                    'savings_goals': [
                        {
                            'id': goal.id,
                            'name': goal.name,
                            'target_amount': float(goal.target_amount),
                            'current_amount': float(goal.current_amount),
                            'progress_percentage': goal.progress_percentage,
                            'target_date': goal.target_date,
                            'is_completed': goal.is_completed
                        } for goal in savings_goals
                    ]
                }
            }, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error obteniendo detalle usuario admin - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al obtener detalles del usuario'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

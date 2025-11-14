# accounts/settings_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import UserSettings
from .settings_serializers import UserSettingsSerializer
import logging

# 👇 Import de logros
from .achievements import unlock, ACH_FIRST_SETTINGS_CHANGE

logger = logging.getLogger('security')

class UserSettingsView(APIView):
    """Vista para obtener y actualizar configuraciones del usuario"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Obtener configuraciones del usuario"""
        try:
            settings, created = UserSettings.objects.get_or_create(
                user=request.user,
                defaults={
                    'currency': 'COP',
                    'theme': 'light',
                    'notifications_enabled': True,
                    'email_notifications': True,
                    'savings_goal_reminder': True,
                    'transaction_reminder': False,
                    'language': 'es'
                }
            )
            
            serializer = UserSettingsSerializer(settings)
            return Response({
                'success': True,
                'settings': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error obteniendo configuraciones - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al obtener configuraciones'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        """Actualizar configuraciones del usuario"""
        try:
            settings, created = UserSettings.objects.get_or_create(
                user=request.user,
                defaults={
                    'currency': 'COP',
                    'theme': 'light',
                    'notifications_enabled': True,
                    'email_notifications': True,
                    'savings_goal_reminder': True,
                    'transaction_reminder': False,
                    'language': 'es'
                }
            )
            
            serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
            
            if serializer.is_valid():
                updated_settings = serializer.save()

                # 🔓 Desbloquear logro: primer cambio en configuración
                try:
                    unlock(request.user, ACH_FIRST_SETTINGS_CHANGE)
                except Exception:
                    pass
                
                logger.info(f"Configuraciones actualizadas - Usuario: {request.user.id}")
                
                return Response({
                    'success': True,
                    'settings': UserSettingsSerializer(updated_settings).data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error actualizando configuraciones - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al actualizar configuraciones'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

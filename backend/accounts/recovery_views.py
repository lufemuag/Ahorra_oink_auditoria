# accounts/recovery_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from .models import Usuario
from .serializers import MeSerializer
import logging

logger = logging.getLogger('security')

class DeletedUsersView(APIView):
    """Vista para listar usuarios eliminados (solo administradores)"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Obtener lista de usuarios eliminados"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Obtener usuarios eliminados
            deleted_users = Usuario.objects.filter(is_deleted=True).order_by('-deleted_at')
            
            users_data = []
            for user in deleted_users:
                users_data.append({
                    'id': user.id,
                    'nombrecompleto': user.nombrecompleto,
                    'correo': user.correo,
                    'deleted_at': user.deleted_at,
                    'deleted_by': user.deleted_by.nombrecompleto if user.deleted_by else 'Sistema',
                    'deletion_reason': user.deletion_reason,
                    'days_deleted': (timezone.now() - user.deleted_at).days if user.deleted_at else 0
                })

            return Response({
                'success': True,
                'deleted_users': users_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error obteniendo usuarios eliminados - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al obtener usuarios eliminados'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RestoreUserView(APIView):
    """Vista para restaurar un usuario eliminado"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        """Restaurar usuario eliminado"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Buscar usuario eliminado
            user = Usuario.objects.filter(id=user_id, is_deleted=True).first()
            
            if not user:
                return Response({
                    'success': False,
                    'error': 'Usuario eliminado no encontrado'
                }, status=status.HTTP_404_NOT_FOUND)

            # Restaurar usuario
            user.restore()
            
            logger.info(f"Usuario restaurado - ID: {user.id}, Nombre: {user.nombrecompleto}, Restaurado por: {request.user.id}")

            return Response({
                'success': True,
                'message': f'Usuario {user.nombrecompleto} restaurado exitosamente',
                'user': {
                    'id': user.id,
                    'nombrecompleto': user.nombrecompleto,
                    'correo': user.correo
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error restaurando usuario - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al restaurar usuario'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SoftDeleteUserView(APIView):
    """Vista para eliminar usuario de forma suave"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        """Eliminar usuario de forma suave"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # No permitir auto-eliminación
            if user_id == request.user.id:
                return Response({
                    'success': False,
                    'error': 'No puedes eliminarte a ti mismo'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Buscar usuario
            user = Usuario.objects.filter(id=user_id, is_deleted=False).first()
            
            if not user:
                return Response({
                    'success': False,
                    'error': 'Usuario no encontrado o ya eliminado'
                }, status=status.HTTP_404_NOT_FOUND)

            # Obtener razón de eliminación
            reason = request.data.get('reason', 'Eliminado por administrador')
            
            # Eliminar usuario de forma suave
            user.soft_delete(deleted_by=request.user, reason=reason)
            
            logger.info(f"Usuario eliminado (soft delete) - ID: {user.id}, Nombre: {user.nombrecompleto}, Eliminado por: {request.user.id}")

            return Response({
                'success': True,
                'message': f'Usuario {user.nombrecompleto} eliminado exitosamente',
                'user': {
                    'id': user.id,
                    'nombrecompleto': user.nombrecompleto,
                    'correo': user.correo,
                    'deleted_at': user.deleted_at
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error eliminando usuario - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al eliminar usuario'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PermanentDeleteUserView(APIView):
    """Vista para eliminar usuario permanentemente (solo para casos extremos)"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        """Eliminar usuario permanentemente"""
        # Verificar si el usuario es admin específico
        if not hasattr(request.user, 'correo') or request.user.correo != 'admin@pascualbravo.edu.co':
            return Response({
                'success': False,
                'error': 'No tienes permisos de administrador'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            # Buscar usuario eliminado
            user = Usuario.objects.filter(id=user_id, is_deleted=True).first()
            
            if not user:
                return Response({
                    'success': False,
                    'error': 'Usuario eliminado no encontrado'
                }, status=status.HTTP_404_NOT_FOUND)

            # Obtener confirmación
            confirm = request.data.get('confirm', False)
            if not confirm:
                return Response({
                    'success': False,
                    'error': 'Se requiere confirmación para eliminación permanente'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Guardar información antes de eliminar
            user_info = {
                'id': user.id,
                'nombrecompleto': user.nombrecompleto,
                'correo': user.correo
            }

            # Eliminar permanentemente
            user.delete()
            
            logger.warning(f"Usuario eliminado permanentemente - ID: {user_info['id']}, Nombre: {user_info['nombrecompleto']}, Eliminado por: {request.user.id}")

            return Response({
                'success': True,
                'message': f'Usuario {user_info["nombrecompleto"]} eliminado permanentemente',
                'user': user_info
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error eliminando usuario permanentemente - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Error al eliminar usuario permanentemente'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

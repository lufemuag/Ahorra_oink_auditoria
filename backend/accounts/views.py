# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterUsuarioSerializer,
    LoginUsuarioSerializer,
    MeSerializer,
    UpdateMeSerializer,
    ChangePasswordSerializer,
    UpdateSavingsMethodSerializer,
)

# 👇 Import para logros
from .achievements import unlock, ACH_LOGIN, ACH_SAVING_METHOD_SELECTED


# -------- Registro --------
class RegisterUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Crear categorías predeterminadas para el nuevo usuario
            self.create_default_categories(user)
            
            # Generar token JWT para el nuevo usuario
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            
            data_user = MeSerializer(user).data
            return Response({
                "success": True, 
                "user": data_user,
                "token": token,
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    def create_default_categories(self, user):
        """Crear categorías predeterminadas para un nuevo usuario"""
        from .models import Category
        
        default_categories = [
            # Gastos
            {'name': 'Alimentación', 'description': 'Comida y bebidas', 'color': '#ff6b6b', 'icon': 'FaUtensils'},
            {'name': 'Transporte', 'description': 'Transporte público, gasolina, etc.', 'color': '#4ecdc4', 'icon': 'FaCar'},
            {'name': 'Entretenimiento', 'description': 'Ocio y diversión', 'color': '#45b7d1', 'icon': 'FaFilm'},
            {'name': 'Salud', 'description': 'Medicina y salud', 'color': '#96ceb4', 'icon': 'FaHeart'},
            {'name': 'Educación', 'description': 'Libros, cursos, etc.', 'color': '#ffeaa7', 'icon': 'FaBook'},
            {'name': 'Vivienda', 'description': 'Alquiler, servicios, etc.', 'color': '#dfe6e9', 'icon': 'FaHome'},
            {'name': 'Otros', 'description': 'Otros gastos', 'color': '#74b9ff', 'icon': 'FaEllipsisH'},
            
            # Ingresos
            {'name': 'Salario', 'description': 'Ingreso mensual', 'color': '#00b894', 'icon': 'FaDollarSign'},
            {'name': 'Freelance', 'description': 'Trabajos independientes', 'color': '#6c5ce7', 'icon': 'FaBriefcase'},
            {'name': 'Inversiones', 'description': 'Rendimientos de inversiones', 'color': '#fd79a8', 'icon': 'FaChartLine'},
            {'name': 'Ventas', 'description': 'Venta de productos', 'color': '#fdcb6e', 'icon': 'FaShoppingCart'},
            {'name': 'Bonificaciones', 'description': 'Bonos y extras', 'color': '#e17055', 'icon': 'FaGift'},
            {'name': 'Otros ingresos', 'description': 'Otros ingresos', 'color': '#00cec9', 'icon': 'FaMoneyBillWave'},
            
            # Ahorros
            {'name': 'Fondo de emergencia', 'description': 'Ahorro para emergencias', 'color': '#d63031', 'icon': 'FaExclamationTriangle'},
            {'name': 'Vacaciones', 'description': 'Ahorro para viajes', 'color': '#0984e3', 'icon': 'FaPlane'},
            {'name': 'Casa', 'description': 'Ahorro para vivienda', 'color': '#00b894', 'icon': 'FaHome'},
            {'name': 'Coche', 'description': 'Ahorro para vehículo', 'color': '#636e72', 'icon': 'FaCar'},
            {'name': 'Retiro', 'description': 'Ahorro para jubilación', 'color': '#a29bfe', 'icon': 'FaPiggyBank'},
            {'name': 'Otros ahorros', 'description': 'Otros ahorros', 'color': '#55efc4', 'icon': 'FaWallet'},
        ]
        
        for cat_data in default_categories:
            Category.objects.create(
                user=user,
                name=cat_data['name'],
                description=cat_data['description'],
                color=cat_data['color'],
                icon=cat_data['icon']
            )


# -------- Login (JWT) --------
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def decrypt_credentials(self, encrypted_data):
        """Desencriptar credenciales del frontend"""
        from .encryption_utils import decrypt_credentials
        return decrypt_credentials(encrypted_data)

    def post(self, request):
        # Verificar si los datos están encriptados
        if 'u' in request.data and 'p' in request.data:
            # Datos encriptados del frontend
            decrypted_creds = self.decrypt_credentials(request.data)
            if not decrypted_creds:
                return Response({"success": False, "error": "Credenciales inválidas o expiradas"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Usar credenciales desencriptadas
            login_data = {
                'username': decrypted_creds['username'],
                'password': decrypted_creds['password']
            }
        else:
            # Datos normales (para compatibilidad con otras herramientas)
            login_data = request.data
        
        serializer = LoginUsuarioSerializer(data=login_data)
        if not serializer.is_valid():
            return Response({"success": False, "error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        
        # Verificar si la cuenta está eliminada (soft delete)
        if user.is_deleted:
            return Response({
                "success": False, 
                "error": "Esta cuenta ha sido eliminada. Contacta a un administrador para reactivarla."
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        data_user = MeSerializer(user).data

        # 🔓 Desbloquear logro: iniciar sesión
        try:
            unlock(user, ACH_LOGIN)
        except Exception:
            pass

        return Response(
            {
                "success": True,
                "token": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": data_user["id"],
                    "nombre": data_user["nombrecompleto"],
                    "correo": data_user["correo"],
                },
            },
            status=status.HTTP_200_OK,
        )


# -------- /auth/me/ --------
class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = MeSerializer(request.user).data
        user = request.user
        return Response(
            {
                "id": data["id"], 
                "nombrecompleto": data["nombrecompleto"], 
                "correo": data["correo"],
                "current_balance": float(user.current_balance),
                "savings_method": {
                    "method": user.selected_savings_method,
                    "monthly_income": float(user.monthly_income) if user.monthly_income else None,
                    "selected_at": user.savings_method_selected_at.isoformat() if user.savings_method_selected_at else None,
                    "can_change": user.can_change_savings_method(),
                    "days_until_change": user.days_until_can_change_method()
                }
            },
            status=status.HTTP_200_OK,
        )


# -------- /auth/me/detail/ (PUT/DELETE) --------
class MeDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Actualiza nombre y/o correo
    def put(self, request):
        serializer = UpdateMeSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user = serializer.update(request.user, serializer.validated_data)
            user_data = MeSerializer(user).data
            return Response(
                {"success": True, "user": {"id": user_data["id"], "nombre": user_data["nombrecompleto"], "correo": user_data["correo"]}},
                status=status.HTTP_200_OK,
            )
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # Elimina cuenta
    def delete(self, request):
        request.user.delete()
        return Response({"success": True}, status=status.HTTP_200_OK)


# -------- /auth/me/change-password/ (POST) --------
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_200_OK)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# -------- /auth/me/set-initial-balance/ (POST) --------
class SetInitialBalanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Establecer el balance inicial del usuario (desde dashboard)"""
        from decimal import Decimal
        import logging
        logger = logging.getLogger('security')
        
        try:
            amount_raw = request.data.get('amount')
            
            if amount_raw is None:
                return Response({
                    "success": False, 
                    "error": "El campo 'amount' es requerido"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Convertir a Decimal en lugar de float
            amount = Decimal(str(amount_raw))
            
            if amount <= 0:
                return Response({
                    "success": False, 
                    "error": "El monto debe ser mayor a 0"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if amount > Decimal('1000000000'):
                return Response({
                    "success": False, 
                    "error": "El monto no puede exceder 1 billón"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Sumar al balance actual (ambos son Decimal ahora)
            request.user.current_balance += amount
            request.user.save(update_fields=['current_balance'])
            
            # Crear una transacción de ingreso para el valor inicial
            from .models import Transaction
            from django.utils import timezone
            
            initial_transaction = Transaction.objects.create(
                user=request.user,
                type='income',
                amount=amount,
                description='Balance inicial del dashboard',
                date=timezone.now().date(),
                category=None  # Sin categoría para el balance inicial
            )
            
            logger.info(f"Balance actualizado para usuario {request.user.id}: {request.user.current_balance}")
            logger.info(f"Transacción inicial creada: ID {initial_transaction.id}, Monto: {amount}")
            
            return Response({
                "success": True, 
                "current_balance": float(request.user.current_balance),
                "transaction_id": initial_transaction.id
            }, status=status.HTTP_200_OK)
        except (ValueError, TypeError) as e:
            logger.error(f"Error al convertir amount: {str(e)}")
            return Response({
                "success": False, 
                "error": "Monto inválido"
            }, status=status.HTTP_400_BAD_REQUEST)


# -------- /auth/me/delete-account/ (POST) --------
class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Permitir al usuario eliminar su propia cuenta"""
        try:
            user = request.user
            
            # Verificar que el usuario proporcione su contraseña para confirmar
            password = request.data.get('password')
            if not password:
                return Response({
                    "success": False,
                    "error": "Se requiere la contraseña para confirmar la eliminación"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar la contraseña
            from django.contrib.auth.hashers import check_password
            if not check_password(password, user.contraseniaencriptada):
                return Response({
                    "success": False,
                    "error": "Contraseña incorrecta"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Obtener razón de eliminación (opcional)
            reason = request.data.get('reason', 'Usuario eliminó su propia cuenta')
            
            # Eliminar usuario de forma suave
            user.soft_delete(reason=reason)
            
            # Log de eliminación
            import logging
            logger = logging.getLogger('security')
            logger.info(f"Usuario eliminó su propia cuenta - ID: {user.id}, Nombre: {user.nombrecompleto}")
            
            return Response({
                "success": True,
                "message": "Tu cuenta ha sido eliminada exitosamente"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            import logging
            logger = logging.getLogger('security')
            logger.error(f"Error eliminando cuenta - Usuario: {request.user.id}, Error: {str(e)}")
            return Response({
                "success": False,
                "error": "Error al eliminar la cuenta"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -------- /auth/me/savings-method/ --------
class UpdateSavingsMethodView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        from django.utils import timezone
        
        user = request.user
        
        # Verificar si puede cambiar el método (15 días desde la última selección)
        if not user.can_change_savings_method():
            days_remaining = user.days_until_can_change_method()
            return Response({
                "success": False,
                "error": f"Debes esperar {days_remaining} días para cambiar tu método de ahorro",
                "days_remaining": days_remaining,
                "can_change": False
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UpdateSavingsMethodSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.update(request.user, serializer.validated_data)
            # Actualizar la fecha de selección
            user.savings_method_selected_at = timezone.now()
            user.save(update_fields=['savings_method_selected_at'])

            # 🔓 Desbloquear logro: seleccionar método de ahorro
            try:
                unlock(request.user, ACH_SAVING_METHOD_SELECTED)
            except Exception:
                pass
            
            return Response({
                "success": True,
                "message": "Método de ahorro actualizado correctamente",
                "data": {
                    "method": user.selected_savings_method,
                    "monthly_income": float(user.monthly_income) if user.monthly_income else None,
                    "selected_at": user.savings_method_selected_at.isoformat() if user.savings_method_selected_at else None,
                    "can_change": user.can_change_savings_method(),
                    "days_until_change": user.days_until_can_change_method()
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "error": "Datos inválidos",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """Obtener el método de ahorro actual del usuario"""
        user = request.user
        return Response({
            "success": True,
            "data": {
                "method": user.selected_savings_method,
                "monthly_income": float(user.monthly_income) if user.monthly_income else None,
                "selected_at": user.savings_method_selected_at.isoformat() if user.savings_method_selected_at else None,
                "can_change": user.can_change_savings_method(),
                "days_until_change": user.days_until_can_change_method()
            }
        }, status=status.HTTP_200_OK)

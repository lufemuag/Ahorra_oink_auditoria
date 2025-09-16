const PASSWORD_RESET_KEY = 'ahorra_oink_password_resets';
const USERS_KEY = 'ahorra_oink_users';

export const passwordResetService = {
  // Solicitar restablecimiento de contraseña
  requestPasswordReset: (email, username) => {
    try {
      // Verificar si el usuario existe
      const users = getUsers();
      const user = users.find(u => 
        u.username === username && 
        u.email === email
      );

      if (!user) {
        return { 
          success: false, 
          error: 'No se encontró una cuenta con los datos proporcionados' 
        };
      }

      // Crear token de restablecimiento
      const resetToken = generateResetToken();
      const resetData = {
        userId: user.id,
        email: email,
        username: username,
        token: resetToken,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        used: false
      };

      // Guardar solicitud de restablecimiento
      const resetRequests = getPasswordResets();
      resetRequests.push(resetData);
      localStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify(resetRequests));

      // En una aplicación real, aquí se enviaría un email
      // Por ahora, simulamos el envío
      console.log(`Email de restablecimiento enviado a: ${email}`);
      console.log(`Token: ${resetToken}`);

      return { 
        success: true, 
        message: 'Instrucciones enviadas a tu correo electrónico',
        token: resetToken // Solo para desarrollo
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return { 
        success: false, 
        error: 'Error al procesar la solicitud' 
      };
    }
  },

  // Verificar token de restablecimiento
  verifyResetToken: (token) => {
    try {
      const resetRequests = getPasswordResets();
      const resetData = resetRequests.find(r => 
        r.token === token && 
        !r.used && 
        new Date(r.expiresAt) > new Date()
      );

      if (!resetData) {
        return { 
          success: false, 
          error: 'Token inválido o expirado' 
        };
      }

      return { 
        success: true, 
        resetData: resetData 
      };
    } catch (error) {
      console.error('Error verifying reset token:', error);
      return { 
        success: false, 
        error: 'Error al verificar el token' 
      };
    }
  },

  // Restablecer contraseña
  resetPassword: (token, newPassword) => {
    try {
      // Verificar token
      const tokenResult = passwordResetService.verifyResetToken(token);
      if (!tokenResult.success) {
        return tokenResult;
      }

      const { resetData } = tokenResult;

      // Actualizar contraseña del usuario
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === resetData.userId);
      
      if (userIndex === -1) {
        return { 
          success: false, 
          error: 'Usuario no encontrado' 
        };
      }

      // En una aplicación real, aquí se encriptaría la contraseña
      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Marcar token como usado
      const resetRequests = getPasswordResets();
      const resetIndex = resetRequests.findIndex(r => r.token === token);
      if (resetIndex !== -1) {
        resetRequests[resetIndex].used = true;
        resetRequests[resetIndex].usedAt = new Date().toISOString();
        localStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify(resetRequests));
      }

      return { 
        success: true, 
        message: 'Contraseña restablecida exitosamente' 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { 
        success: false, 
        error: 'Error al restablecer la contraseña' 
      };
    }
  },

  // Limpiar tokens expirados
  cleanExpiredTokens: () => {
    try {
      const resetRequests = getPasswordResets();
      const now = new Date();
      const validRequests = resetRequests.filter(r => 
        new Date(r.expiresAt) > now
      );
      
      localStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify(validRequests));
      return { success: true, cleaned: resetRequests.length - validRequests.length };
    } catch (error) {
      console.error('Error cleaning expired tokens:', error);
      return { success: false, error: 'Error al limpiar tokens expirados' };
    }
  },

  // Obtener solicitudes de restablecimiento por usuario
  getUserResetRequests: (userId) => {
    try {
      const resetRequests = getPasswordResets();
      return resetRequests.filter(r => r.userId === userId);
    } catch (error) {
      console.error('Error getting user reset requests:', error);
      return [];
    }
  }
};

// Funciones auxiliares
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (error) {
    console.error('Error parsing users data:', error);
    return [];
  }
}

function getPasswordResets() {
  try {
    return JSON.parse(localStorage.getItem(PASSWORD_RESET_KEY) || '[]');
  } catch (error) {
    console.error('Error parsing password resets data:', error);
    return [];
  }
}

function generateResetToken() {
  // Generar token aleatorio para desarrollo
  // En producción, usar un método más seguro
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Limpiar tokens expirados al cargar el servicio
passwordResetService.cleanExpiredTokens();







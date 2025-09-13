import { generateUniqueId } from '../utils/idGenerator';

const AUTH_KEY = 'ahorra_oink_auth';
const USER_KEY = 'ahorra_oink_user';
const USERS_KEY = 'ahorra_oink_users';

export const authService = {
  // Inicializar usuario administrador por defecto
  initializeDefaultAdmin: () => {
    const users = getUsers();
    
    // Verificar si ya existe un usuario admin
    const adminExists = users.find(u => u.username === 'admin');
    
    if (!adminExists) {
      const defaultAdmin = {
        id: 'admin-001',
        username: 'admin',
        password: 'abretecesamo',
        firstName: 'Administrador',
        lastName: 'Sistema',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          notifications: true,
          currency: 'USD',
          theme: 'light'
        },
        achievements: [],
        stats: {
          totalSavings: 0,
          totalIncome: 0,
          totalExpenses: 0,
          streak: 0
        }
      };
      
      users.push(defaultAdmin);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      console.log('Usuario administrador por defecto creado');
    }

    // Si no hay usuario autenticado, hacer login automático del admin
    if (!authService.isAuthenticated()) {
      console.log('No hay usuario autenticado, haciendo login automático del admin');
      const loginResult = authService.login('admin', 'abretecesamo');
      if (loginResult.success) {
        console.log('Login automático del admin exitoso');
      } else {
        console.log('Error en login automático del admin:', loginResult.error);
      }
    }
  },

  // Login
  login: (username, password) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const authData = {
        isAuthenticated: true,
        user: { ...user, password: undefined }, // No guardar password en auth
        token: generateToken(),
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      return { success: true, user: authData.user };
    }
    
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  },

  // Register
  register: async (userData) => {
    const users = getUsers();
    
    // Verificar si el username ya existe
    if (users.find(u => u.username === userData.username)) {
      return { success: false, error: 'El nombre de usuario ya está registrado' };
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: generateUniqueId(),
      username: userData.username,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user', // Rol por defecto para usuarios normales
      createdAt: new Date().toISOString(),
      settings: {
        notifications: true,
        currency: 'USD',
        theme: 'light'
      },
      achievements: [],
      stats: {
        totalSavings: 0,
        totalIncome: 0,
        totalExpenses: 0,
        streak: 0
      }
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Crear notificaciones automáticas para el nuevo usuario
    try {
      const { notificationService } = await import('./notificationService');
      notificationService.createAutomaticNotifications(newUser.id);
    } catch (error) {
      console.log('Error creating automatic notifications:', error);
    }
    
    // Auto login después del registro
    return authService.login(userData.username, userData.password);
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    return { success: true };
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const auth = getAuthData();
    if (!auth || !auth.isAuthenticated) return false;
    
    // Verificar si el token no ha expirado (24 horas)
    const loginTime = new Date(auth.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      authService.logout();
      return false;
    }
    
    return true;
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const auth = getAuthData();
    return auth?.user || null;
  },

  // Actualizar perfil de usuario
  updateProfile: (userData) => {
    const auth = getAuthData();
    if (!auth || !auth.user) return { success: false, error: 'No hay usuario autenticado' };
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === auth.user.id);
    
    if (userIndex === -1) return { success: false, error: 'Usuario no encontrado' };
    
    // Actualizar datos del usuario
    const updatedUser = { 
      ...users[userIndex], 
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Actualizar auth
    const updatedAuth = {
      ...auth,
      user: { ...updatedUser, password: undefined }
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedAuth));
    
    return { success: true, user: updatedAuth.user };
  },

  // Cambiar contraseña
  changePassword: (currentPassword, newPassword) => {
    const auth = getAuthData();
    if (!auth || !auth.user) return { success: false, error: 'No hay usuario autenticado' };
    
    const users = getUsers();
    const user = users.find(u => u.id === auth.user.id);
    
    if (!user || user.password !== currentPassword) {
      return { success: false, error: 'Contraseña actual incorrecta' };
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    
    const userIndex = users.findIndex(u => u.id === auth.user.id);
    users[userIndex] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true };
  },

  // Recuperar contraseña (simulación)
  forgotPassword: (username) => {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    // En una app real, aquí se enviaría un email de recuperación
    // Por ahora solo simulamos que se envió
    return { 
      success: true, 
      message: 'Se ha enviado información de recuperación (funcionalidad simulada)' 
    };
  },

  // Verificar si el usuario actual es administrador
  isAdmin: () => {
    const auth = getAuthData();
    return auth?.user?.role === 'admin';
  },

  // Obtener todos los usuarios (solo para administradores)
  getAllUsers: () => {
    if (!authService.isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }
    
    const users = getUsers();
    // Remover passwords de la respuesta
    const safeUsers = users.map(user => ({
      ...user,
      password: undefined
    }));
    
    return { success: true, users: safeUsers };
  }
};

// Funciones auxiliares
function getAuthData() {
  try {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
}

function getUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error parsing users data:', error);
    return [];
  }
}

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
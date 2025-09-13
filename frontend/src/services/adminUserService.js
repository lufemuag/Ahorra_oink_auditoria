import { generateUniqueId } from '../utils/idGenerator';

const USERS_KEY = 'ahorra_oink_users';

export const adminUserService = {
  // Crear nuevo usuario (solo admin)
  createUser: (userData) => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      
      // Verificar si el username ya existe
      if (users.find(u => u.username === userData.username)) {
        return { success: false, error: 'El nombre de usuario ya está registrado' };
      }

      // Verificar si el email ya existe (si se proporciona)
      if (userData.email && users.find(u => u.email === userData.email)) {
        return { success: false, error: 'El email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser = {
        id: generateUniqueId(),
        username: userData.username,
        password: userData.password,
        email: userData.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: getCurrentUser().id,
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

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Error al crear el usuario' };
    }
  },

  // Obtener todos los usuarios (solo admin)
  getAllUsers: () => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      // Remover passwords de la respuesta
      const safeUsers = users.map(user => ({
        ...user,
        password: undefined
      }));

      return { success: true, users: safeUsers };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: 'Error al obtener usuarios' };
    }
  },

  // Obtener usuario por ID (solo admin)
  getUserById: (userId) => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Remover password de la respuesta
      const safeUser = { ...user, password: undefined };
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return { success: false, error: 'Error al obtener usuario' };
    }
  },

  // Actualizar usuario (solo admin)
  updateUser: (userId, updateData) => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Verificar username único si se está cambiando
      if (updateData.username && updateData.username !== users[userIndex].username) {
        if (users.find(u => u.username === updateData.username && u.id !== userId)) {
          return { success: false, error: 'El nombre de usuario ya está registrado' };
        }
      }

      // Verificar email único si se está cambiando
      if (updateData.email && updateData.email !== users[userIndex].email) {
        if (users.find(u => u.email === updateData.email && u.id !== userId)) {
          return { success: false, error: 'El email ya está registrado' };
        }
      }

      // Actualizar usuario
      const updatedUser = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Remover password de la respuesta
      const safeUser = { ...updatedUser, password: undefined };
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Error al actualizar usuario' };
    }
  },

  // Desactivar/Activar usuario (solo admin)
  toggleUserStatus: (userId) => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // No permitir desactivar al administrador actual
      if (users[userIndex].id === getCurrentUser().id) {
        return { success: false, error: 'No puedes desactivar tu propia cuenta' };
      }

      users[userIndex].isActive = !users[userIndex].isActive;
      users[userIndex].updatedAt = new Date().toISOString();

      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Error toggling user status:', error);
      return { success: false, error: 'Error al cambiar estado del usuario' };
    }
  },

  // Eliminar usuario (solo admin)
  deleteUser: (userId) => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // No permitir eliminar al administrador actual
      if (users[userIndex].id === getCurrentUser().id) {
        return { success: false, error: 'No puedes eliminar tu propia cuenta' };
      }

      // No permitir eliminar el último administrador
      const adminCount = users.filter(u => u.role === 'admin' && u.isActive).length;
      if (users[userIndex].role === 'admin' && adminCount <= 1) {
        return { success: false, error: 'No se puede eliminar el último administrador' };
      }

      users.splice(userIndex, 1);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Error al eliminar usuario' };
    }
  },

  // Obtener estadísticas de usuarios (solo admin)
  getUserStats: () => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado. Solo administradores.' };
    }

    try {
      const users = getUsers();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        admins: users.filter(u => u.role === 'admin').length,
        regularUsers: users.filter(u => u.role === 'user').length,
        newThisWeek: users.filter(u => new Date(u.createdAt) >= oneWeekAgo).length,
        newThisMonth: users.filter(u => new Date(u.createdAt) >= oneMonthAgo).length,
        totalSavings: users.reduce((sum, u) => sum + (u.stats?.totalSavings || 0), 0),
        totalIncome: users.reduce((sum, u) => sum + (u.stats?.totalIncome || 0), 0),
        totalExpenses: users.reduce((sum, u) => sum + (u.stats?.totalExpenses || 0), 0)
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { success: false, error: 'Error al obtener estadísticas' };
    }
  }
};

// Funciones auxiliares
function getUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error parsing users data:', error);
    return [];
  }
}

function getCurrentUser() {
  try {
    const auth = localStorage.getItem('ahorra_oink_auth');
    const authData = auth ? JSON.parse(auth) : null;
    return authData?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

function isAdmin() {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'admin';
}

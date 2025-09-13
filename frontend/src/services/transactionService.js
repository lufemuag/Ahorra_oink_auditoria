import { generateUniqueId } from '../utils/idGenerator';

const TRANSACTIONS_KEY = 'ahorra_oink_transactions';

export const transactionService = {
  // Crear nueva transacción
  create: (transactionData) => {
    try {
      const transactions = getTransactions();
      const newTransaction = {
        id: generateUniqueId(),
        userId: transactionData.userId,
        type: transactionData.type, // 'income' o 'expense'
        amount: parseFloat(transactionData.amount),
        category: transactionData.category,
        description: transactionData.description,
        date: transactionData.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        tags: transactionData.tags || []
      };
      
      transactions.push(newTransaction);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      
      // Actualizar estadísticas del usuario
      updateUserStats(transactionData.userId, newTransaction);
      
      // Verificar logros automáticamente
      try {
        const { achievementService } = require('./achievementService');
        achievementService.checkSpecificAchievements(
          transactionData.userId, 
          'transaction', 
          { type: newTransaction.type, amount: newTransaction.amount }
        );
      } catch (error) {
        console.log('Error checking achievements:', error);
      }
      
      return { success: true, transaction: newTransaction };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { success: false, error: 'Error al crear la transacción' };
    }
  },

  // Obtener transacciones del usuario
  getByUser: (userId) => {
    try {
      const transactions = getTransactions();
      return transactions.filter(t => t.userId === userId);
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  // Obtener transacciones por tipo
  getByType: (userId, type) => {
    try {
      const transactions = getTransactions();
      return transactions.filter(t => t.userId === userId && t.type === type);
    } catch (error) {
      console.error('Error getting transactions by type:', error);
      return [];
    }
  },

  // Obtener estadísticas del usuario
  getUserStats: (userId) => {
    try {
      const transactions = getTransactions();
      const userTransactions = transactions.filter(t => t.userId === userId);
      
      const stats = {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        transactionCount: userTransactions.length
      };
      
      userTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
          stats.totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
          stats.totalExpenses += transaction.amount;
        }
      });
      
      stats.totalSavings = stats.totalIncome - stats.totalExpenses;
      
      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        transactionCount: 0
      };
    }
  },

  // Eliminar transacción
  delete: (transactionId) => {
    try {
      const transactions = getTransactions();
      const transactionIndex = transactions.findIndex(t => t.id === transactionId);
      
      if (transactionIndex === -1) {
        return { success: false, error: 'Transacción no encontrada' };
      }
      
      const deletedTransaction = transactions[transactionIndex];
      transactions.splice(transactionIndex, 1);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      
      // Actualizar estadísticas del usuario (revertir)
      revertUserStats(deletedTransaction.userId, deletedTransaction);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { success: false, error: 'Error al eliminar la transacción' };
    }
  },

  // Obtener categorías disponibles
  getCategories: (type) => {
    const incomeCategories = [
      'Salario',
      'Freelance',
      'Inversiones',
      'Ventas',
      'Bonificaciones',
      'Otros ingresos'
    ];
    
    const expenseCategories = [
      'Alimentación',
      'Transporte',
      'Vivienda',
      'Entretenimiento',
      'Salud',
      'Educación',
      'Ropa',
      'Servicios',
      'Otros gastos'
    ];
    
    return type === 'income' ? incomeCategories : expenseCategories;
  }
};

// Funciones auxiliares
function getTransactions() {
  try {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error parsing transactions data:', error);
    return [];
  }
}

function updateUserStats(userId, transaction) {
  try {
    const users = JSON.parse(localStorage.getItem('ahorra_oink_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const user = users[userIndex];
      
      if (transaction.type === 'income') {
        user.stats.totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        user.stats.totalExpenses += transaction.amount;
      }
      
      user.stats.totalSavings = user.stats.totalIncome - user.stats.totalExpenses;
      user.updatedAt = new Date().toISOString();
      
      users[userIndex] = user;
      localStorage.setItem('ahorra_oink_users', JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

function revertUserStats(userId, transaction) {
  try {
    const users = JSON.parse(localStorage.getItem('ahorra_oink_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const user = users[userIndex];
      
      if (transaction.type === 'income') {
        user.stats.totalIncome -= transaction.amount;
      } else if (transaction.type === 'expense') {
        user.stats.totalExpenses -= transaction.amount;
      }
      
      user.stats.totalSavings = user.stats.totalIncome - user.stats.totalExpenses;
      user.updatedAt = new Date().toISOString();
      
      users[userIndex] = user;
      localStorage.setItem('ahorra_oink_users', JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error reverting user stats:', error);
  }
}

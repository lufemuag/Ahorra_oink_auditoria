import { generateUniqueId } from '../utils/idGenerator';

const GOALS_KEY = 'ahorra_oink_goals';

export const goalService = {
  // Crear nueva meta
  create: (goalData) => {
    try {
      const goals = getGoals();
      const newGoal = {
        id: generateUniqueId(),
        userId: goalData.userId,
        title: goalData.title,
        targetAmount: parseFloat(goalData.targetAmount),
        currentAmount: parseFloat(goalData.currentAmount) || 0,
        targetDate: goalData.targetDate,
        category: goalData.category,
        priority: goalData.priority || 'medium',
        description: goalData.description || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      
      goals.push(newGoal);
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
      
      return { success: true, goal: newGoal };
    } catch (error) {
      console.error('Error creating goal:', error);
      return { success: false, error: 'Error al crear la meta' };
    }
  },

  // Obtener metas del usuario
  getByUser: (userId) => {
    try {
      const goals = getGoals();
      return goals.filter(g => g.userId === userId);
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  },

  // Obtener metas activas
  getActive: (userId) => {
    try {
      const goals = getGoals();
      return goals.filter(g => g.userId === userId && g.isActive);
    } catch (error) {
      console.error('Error getting active goals:', error);
      return [];
    }
  },

  // Obtener meta por ID
  getById: (goalId) => {
    try {
      const goals = getGoals();
      return goals.find(g => g.id === goalId);
    } catch (error) {
      console.error('Error getting goal by ID:', error);
      return null;
    }
  },

  // Actualizar meta
  update: (goalId, updateData) => {
    try {
      const goals = getGoals();
      const goalIndex = goals.findIndex(g => g.id === goalId);
      
      if (goalIndex === -1) {
        return { success: false, error: 'Meta no encontrada' };
      }
      
      const updatedGoal = {
        ...goals[goalIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      goals[goalIndex] = updatedGoal;
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
      
      return { success: true, goal: updatedGoal };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: 'Error al actualizar la meta' };
    }
  },

  // Actualizar progreso de meta
  updateProgress: (goalId, amount) => {
    try {
      const goals = getGoals();
      const goalIndex = goals.findIndex(g => g.id === goalId);
      
      if (goalIndex === -1) {
        return { success: false, error: 'Meta no encontrada' };
      }
      
      const goal = goals[goalIndex];
      const newAmount = goal.currentAmount + parseFloat(amount);
      
      // Verificar si la meta se completó
      const isCompleted = newAmount >= goal.targetAmount;
      
      const updatedGoal = {
        ...goal,
        currentAmount: newAmount,
        isActive: !isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      };
      
      goals[goalIndex] = updatedGoal;
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
      
      // Si la meta se completó, verificar logros
      if (isCompleted) {
        try {
          const { achievementService } = require('./achievementService');
          achievementService.checkSpecificAchievements(
            goal.userId, 
            'goal_completed', 
            updatedGoal
          );
        } catch (error) {
          console.log('Error checking achievements:', error);
        }
      }
      
      return { success: true, goal: updatedGoal, completed: isCompleted };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      return { success: false, error: 'Error al actualizar el progreso' };
    }
  },

  // Eliminar meta
  delete: (goalId) => {
    try {
      const goals = getGoals();
      const filteredGoals = goals.filter(g => g.id !== goalId);
      localStorage.setItem(GOALS_KEY, JSON.stringify(filteredGoals));
      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: 'Error al eliminar la meta' };
    }
  },

  // Obtener estadísticas de metas
  getStats: (userId) => {
    try {
      const goals = getGoals();
      const userGoals = goals.filter(g => g.userId === userId);
      
      const stats = {
        total: userGoals.length,
        active: userGoals.filter(g => g.isActive).length,
        completed: userGoals.filter(g => !g.isActive && g.completedAt).length,
        totalTargetAmount: userGoals.reduce((sum, g) => sum + g.targetAmount, 0),
        totalCurrentAmount: userGoals.reduce((sum, g) => sum + g.currentAmount, 0)
      };
      
      stats.completionRate = stats.total > 0 ? 
        Math.round((stats.completed / stats.total) * 100) : 0;
      
      stats.progressRate = stats.totalTargetAmount > 0 ? 
        Math.round((stats.totalCurrentAmount / stats.totalTargetAmount) * 100) : 0;
      
      return stats;
    } catch (error) {
      console.error('Error getting goal stats:', error);
      return {
        total: 0,
        active: 0,
        completed: 0,
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        completionRate: 0,
        progressRate: 0
      };
    }
  }
};

// Funciones auxiliares
function getGoals() {
  try {
    const goals = localStorage.getItem(GOALS_KEY);
    return goals ? JSON.parse(goals) : [];
  } catch (error) {
    console.error('Error parsing goals data:', error);
    return [];
  }
}
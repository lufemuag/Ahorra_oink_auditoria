const ACHIEVEMENTS_KEY = 'ahorra_oink_achievements';

export const achievementService = {
  // Definir todos los logros disponibles
  getAvailableAchievements: () => {
    return [
      {
        id: 'first_save',
        name: 'Primer Ahorro',
        description: 'Registró su primer ahorro',
        icon: 'FaTrophy',
        category: 'savings',
        requirement: { type: 'savings_count', value: 1 },
        reward: { type: 'badge', value: 'first_saver' },
        points: 10
      },
      {
        id: 'streak_7',
        name: 'Racha de 7 días',
        description: 'Ahorró por 7 días consecutivos',
        icon: 'FaMedal',
        category: 'streak',
        requirement: { type: 'streak_days', value: 7 },
        reward: { type: 'badge', value: 'week_warrior' },
        points: 25
      },
      {
        id: 'streak_30',
        name: 'Racha de 30 días',
        description: 'Ahorró por 30 días consecutivos',
        icon: 'FaStar',
        category: 'streak',
        requirement: { type: 'streak_days', value: 30 },
        reward: { type: 'badge', value: 'month_master' },
        points: 100
      },
      {
        id: 'first_goal',
        name: 'Meta Alcanzada',
        description: 'Completó su primera meta de ahorro',
        icon: 'FaBullseye',
        category: 'goals',
        requirement: { type: 'goals_completed', value: 1 },
        reward: { type: 'badge', value: 'goal_getter' },
        points: 50
      },
      {
        id: 'savings_1000',
        name: 'Ahorrador Experto',
        description: 'Ahorró más de $1,000',
        icon: 'FaGem',
        category: 'savings',
        requirement: { type: 'total_savings', value: 1000 },
        reward: { type: 'badge', value: 'expert_saver' },
        points: 75
      },
      {
        id: 'savings_5000',
        name: 'Ahorrador Maestro',
        description: 'Ahorró más de $5,000',
        icon: 'FaCrown',
        category: 'savings',
        requirement: { type: 'total_savings', value: 5000 },
        reward: { type: 'badge', value: 'master_saver' },
        points: 200
      },
      {
        id: 'budget_master',
        name: 'Maestro del Presupuesto',
        description: 'Mantuvo un presupuesto por 30 días',
        icon: 'FaChartLine',
        category: 'budget',
        requirement: { type: 'budget_days', value: 30 },
        reward: { type: 'badge', value: 'budget_master' },
        points: 60
      },
      {
        id: 'early_bird',
        name: 'Madrugador',
        description: 'Registró transacciones antes de las 8 AM por 7 días',
        icon: 'FaSun',
        category: 'habits',
        requirement: { type: 'early_transactions', value: 7 },
        reward: { type: 'badge', value: 'early_bird' },
        points: 30
      }
    ];
  },

  // Obtener logros del usuario
  getUserAchievements: (userId) => {
    try {
      const achievements = getAchievements();
      const userAchievements = achievements[userId] || [];
      const availableAchievements = achievementService.getAvailableAchievements();
      
      // Combinar logros disponibles con el progreso del usuario
      return availableAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
        return {
          ...achievement,
          earned: userAchievement ? userAchievement.earned : false,
          earnedAt: userAchievement ? userAchievement.earnedAt : null,
          progress: userAchievement ? userAchievement.progress : 0
        };
      });
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  },

  // Verificar y otorgar logros
  checkAndAwardAchievements: (userId, userStats) => {
    try {
      const achievements = getAchievements();
      const userAchievements = achievements[userId] || [];
      const availableAchievements = achievementService.getAvailableAchievements();
      const newAchievements = [];

      availableAchievements.forEach(achievement => {
        const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
        
        // Si ya tiene el logro, no hacer nada
        if (userAchievement && userAchievement.earned) {
          return;
        }

        // Verificar si cumple el requisito
        const progress = calculateProgress(achievement, userStats);
        const earned = progress >= achievement.requirement.value;

        if (earned) {
          const newAchievement = {
            id: achievement.id,
            earned: true,
            earnedAt: new Date().toISOString(),
            progress: achievement.requirement.value
          };

          // Agregar a la lista de logros del usuario
          const existingIndex = userAchievements.findIndex(ua => ua.id === achievement.id);
          if (existingIndex >= 0) {
            userAchievements[existingIndex] = newAchievement;
          } else {
            userAchievements.push(newAchievement);
          }

          newAchievements.push({
            ...achievement,
            ...newAchievement
          });

          // Crear notificación de logro desbloqueado
          try {
            const { notificationService } = require('./notificationService');
            notificationService.create({
              userId: userId,
              type: 'success',
              title: `🏆 ¡Logro Desbloqueado!`,
              message: `${achievement.name}: ${achievement.description}`,
              priority: 'high'
            });
          } catch (error) {
            console.log('Error creating achievement notification:', error);
          }
        } else {
          // Actualizar progreso sin otorgar el logro
          const progressAchievement = {
            id: achievement.id,
            earned: false,
            earnedAt: null,
            progress: progress
          };

          const existingIndex = userAchievements.findIndex(ua => ua.id === achievement.id);
          if (existingIndex >= 0) {
            userAchievements[existingIndex] = progressAchievement;
          } else {
            userAchievements.push(progressAchievement);
          }
        }
      });

      // Guardar logros actualizados
      achievements[userId] = userAchievements;
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));

      return { success: true, newAchievements };
    } catch (error) {
      console.error('Error checking achievements:', error);
      return { success: false, error: 'Error al verificar logros' };
    }
  },

  // Verificar logros específicos después de acciones del usuario
  checkSpecificAchievements: (userId, actionType, actionData) => {
    try {
      const achievements = getAchievements();
      const userAchievements = achievements[userId] || [];
      const availableAchievements = achievementService.getAvailableAchievements();
      const newAchievements = [];

      // Obtener estadísticas actuales del usuario
      const userStats = getUserStats(userId);

      availableAchievements.forEach(achievement => {
        const userAchievement = userAchievements.find(ua => ua.id === achievement.id);
        
        // Si ya tiene el logro, no hacer nada
        if (userAchievement && userAchievement.earned) {
          return;
        }

        // Verificar logros específicos basados en la acción
        let shouldCheck = false;
        let progress = 0;

        switch (achievement.id) {
          case 'first_save':
            if (actionType === 'transaction' && actionData.type === 'income') {
              shouldCheck = true;
              progress = userStats.totalSavings || 0;
            }
            break;
          case 'streak_7':
            if (actionType === 'transaction') {
              shouldCheck = true;
              progress = userStats.streak || 0;
            }
            break;
          case 'streak_30':
            if (actionType === 'transaction') {
              shouldCheck = true;
              progress = userStats.streak || 0;
            }
            break;
          case 'first_goal':
            if (actionType === 'goal_completed') {
              shouldCheck = true;
              progress = userStats.completedGoals || 0;
            }
            break;
          case 'savings_1000':
            if (actionType === 'transaction' && actionData.type === 'income') {
              shouldCheck = true;
              progress = userStats.totalSavings || 0;
            }
            break;
          case 'savings_5000':
            if (actionType === 'transaction' && actionData.type === 'income') {
              shouldCheck = true;
              progress = userStats.totalSavings || 0;
            }
            break;
          case 'budget_master':
            if (actionType === 'transaction') {
              shouldCheck = true;
              progress = userStats.budgetDays || 0;
            }
            break;
          case 'early_bird':
            if (actionType === 'transaction') {
              shouldCheck = true;
              progress = userStats.earlyTransactions || 0;
            }
            break;
        }

        if (shouldCheck) {
          const earned = progress >= achievement.requirement.value;

          if (earned) {
            const newAchievement = {
              id: achievement.id,
              earned: true,
              earnedAt: new Date().toISOString(),
              progress: achievement.requirement.value
            };

            // Agregar a la lista de logros del usuario
            const existingIndex = userAchievements.findIndex(ua => ua.id === achievement.id);
            if (existingIndex >= 0) {
              userAchievements[existingIndex] = newAchievement;
            } else {
              userAchievements.push(newAchievement);
            }

            newAchievements.push({
              ...achievement,
              ...newAchievement
            });

            // Crear notificación de logro desbloqueado
            try {
              const { notificationService } = require('./notificationService');
              notificationService.create({
                userId: userId,
                type: 'success',
                title: `🏆 ¡Logro Desbloqueado!`,
                message: `${achievement.name}: ${achievement.description}`,
                priority: 'high'
              });
            } catch (error) {
              console.log('Error creating achievement notification:', error);
            }
          } else {
            // Actualizar progreso sin otorgar el logro
            const progressAchievement = {
              id: achievement.id,
              earned: false,
              earnedAt: null,
              progress: progress
            };

            const existingIndex = userAchievements.findIndex(ua => ua.id === achievement.id);
            if (existingIndex >= 0) {
              userAchievements[existingIndex] = progressAchievement;
            } else {
              userAchievements.push(progressAchievement);
            }
          }
        }
      });

      // Guardar logros actualizados
      achievements[userId] = userAchievements;
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));

      return { success: true, newAchievements };
    } catch (error) {
      console.error('Error checking specific achievements:', error);
      return { success: false, error: 'Error al verificar logros específicos' };
    }
  },

  // Obtener estadísticas de logros del usuario
  getUserAchievementStats: (userId) => {
    try {
      const userAchievements = achievementService.getUserAchievements(userId);
      const earnedAchievements = userAchievements.filter(a => a.earned);
      
      const stats = {
        total: userAchievements.length,
        earned: earnedAchievements.length,
        progress: userAchievements.length > 0 ? 
          Math.round((earnedAchievements.length / userAchievements.length) * 100) : 0,
        totalPoints: earnedAchievements.reduce((sum, a) => sum + a.points, 0),
        categories: {
          savings: userAchievements.filter(a => a.category === 'savings' && a.earned).length,
          streak: userAchievements.filter(a => a.category === 'streak' && a.earned).length,
          goals: userAchievements.filter(a => a.category === 'goals' && a.earned).length,
          budget: userAchievements.filter(a => a.category === 'budget' && a.earned).length,
          habits: userAchievements.filter(a => a.category === 'habits' && a.earned).length
        }
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      return { success: false, error: 'Error al obtener estadísticas' };
    }
  },

  // Obtener logros recientes
  getRecentAchievements: (userId, limit = 5) => {
    try {
      const userAchievements = achievementService.getUserAchievements(userId);
      const earnedAchievements = userAchievements
        .filter(a => a.earned)
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, limit);

      return { success: true, achievements: earnedAchievements };
    } catch (error) {
      console.error('Error getting recent achievements:', error);
      return { success: false, error: 'Error al obtener logros recientes' };
    }
  }
};

// Funciones auxiliares
function getAchievements() {
  try {
    const achievements = localStorage.getItem(ACHIEVEMENTS_KEY);
    return achievements ? JSON.parse(achievements) : {};
  } catch (error) {
    console.error('Error parsing achievements data:', error);
    return {};
  }
}

function calculateProgress(achievement, userStats) {
  switch (achievement.requirement.type) {
    case 'savings_count':
      return userStats.totalSavings || 0;
    case 'streak_days':
      return userStats.streak || 0;
    case 'goals_completed':
      return userStats.completedGoals || 0;
    case 'total_savings':
      return userStats.totalSavings || 0;
    case 'budget_days':
      return userStats.budgetDays || 0;
    case 'early_transactions':
      return userStats.earlyTransactions || 0;
    default:
      return 0;
  }
}

function getUserStats(userId) {
  try {
    // Obtener estadísticas del usuario desde localStorage
    const users = JSON.parse(localStorage.getItem('ahorra_oink_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return {
        totalSavings: 0,
        streak: 0,
        completedGoals: 0,
        budgetDays: 0,
        earlyTransactions: 0
      };
    }

    // Obtener transacciones del usuario
    const transactions = JSON.parse(localStorage.getItem('ahorra_oink_transactions') || '[]');
    const userTransactions = transactions.filter(t => t.userId === userId);
    
    // Obtener metas del usuario
    const goals = JSON.parse(localStorage.getItem('ahorra_oink_goals') || '[]');
    const userGoals = goals.filter(g => g.userId === userId);
    
    // Calcular estadísticas
    const totalSavings = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const completedGoals = userGoals.filter(g => !g.isActive && g.completedAt).length;
    
    // Calcular racha (días consecutivos con transacciones)
    const streak = calculateStreak(userTransactions);
    
    // Calcular transacciones tempranas (antes de las 8 AM)
    const earlyTransactions = userTransactions.filter(t => {
      const hour = new Date(t.date).getHours();
      return hour < 8;
    }).length;
    
    // Calcular días de presupuesto (días con transacciones registradas)
    const budgetDays = new Set(userTransactions.map(t => 
      new Date(t.date).toDateString()
    )).size;

    return {
      totalSavings,
      streak,
      completedGoals,
      budgetDays,
      earlyTransactions
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalSavings: 0,
      streak: 0,
      completedGoals: 0,
      budgetDays: 0,
      earlyTransactions: 0
    };
  }
}

function calculateStreak(transactions) {
  if (transactions.length === 0) return 0;
  
  // Ordenar transacciones por fecha
  const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  // Verificar si hay transacciones hoy
  const today = new Date().toDateString();
  const hasTransactionToday = sortedTransactions.some(t => 
    new Date(t.date).toDateString() === today
  );
  
  if (!hasTransactionToday) {
    // Si no hay transacciones hoy, empezar desde ayer
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  // Contar días consecutivos hacia atrás
  for (let i = 0; i < 365; i++) { // Máximo 365 días
    const dateString = currentDate.toDateString();
    const hasTransactionOnDate = sortedTransactions.some(t => 
      new Date(t.date).toDateString() === dateString
    );
    
    if (hasTransactionOnDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

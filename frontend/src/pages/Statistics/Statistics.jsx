import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';
import pigImage from '../../assets/CerdoEstadisticas.png';
import { 
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaDollarSign,
  FaPiggyBank,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaDownload,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import './Statistics.css';

const Statistics = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadStatisticsOptimized();
    }
  }, [user]);

  // Escuchar cambios en las transacciones para actualizar automáticamente
  useEffect(() => {
    if (!user?.id) return;

    const handleStorageChange = (e) => {
      if (e.key === 'ahorra_oink_transactions') {
        // Actualizar estadísticas cuando cambien las transacciones
        loadStatisticsOptimized();
        setUpdateMessage('Estadísticas actualizadas automáticamente');
        setTimeout(() => setUpdateMessage(''), 3000);
      }
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // También escuchar cambios en el mismo tab (para cuando se agregan transacciones)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'ahorra_oink_transactions') {
        // Disparar evento personalizado para el mismo tab
        window.dispatchEvent(new Event('localStorageChange'));
      }
    };

    const handleLocalStorageChange = () => {
      if (user?.id) {
        loadStatisticsOptimized();
        setUpdateMessage('Estadísticas actualizadas automáticamente');
        setTimeout(() => setUpdateMessage(''), 3000);
      }
    };

    window.addEventListener('localStorageChange', handleLocalStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [user?.id]);

  useEffect(() => {
    // Agregar clase al body cuando se monta el componente
    document.body.classList.add('statistics-page-active');
    
    // Limpiar clase del body cuando se desmonta el componente
    return () => {
      document.body.classList.remove('statistics-page-active');
    };
  }, []);

  const loadStatistics = (showMessage = false) => {
    try {
      setLoading(true);
      
      // Obtener transacciones del usuario
      const userTransactions = transactionService.getByUser(user.id);
      
      // Obtener estadísticas por día de la semana
      const weeklyStats = getWeeklyStatistics(userTransactions);
      
      setStatistics(weeklyStats);
      setLastUpdate(new Date());
      
      if (showMessage) {
        setUpdateMessage('Estadísticas actualizadas correctamente');
        setTimeout(() => setUpdateMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      // En caso de error, mostrar datos de ejemplo
      setStatistics(getDefaultStatistics());
      setUpdateMessage('Error al cargar estadísticas');
      setTimeout(() => setUpdateMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyStatistics = (transactions) => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const weeklyData = [];
    
    // Obtener la fecha de inicio de la semana actual
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
    
    // Inicializar datos para cada día de la semana
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      
      const dayStart = new Date(currentDay);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(currentDay);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Filtrar transacciones del día
      const dayTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= dayStart && transactionDate <= dayEnd;
      });
      
      // Calcular totales del día
      let dayIncome = 0;
      let dayExpenses = 0;
      let daySavings = 0;
      
      dayTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
          dayIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
          dayExpenses += transaction.amount;
        } else if (transaction.type === 'savings') {
          daySavings += transaction.amount;
        }
      });
      
      weeklyData.push({
        day: daysOfWeek[i],
        income: dayIncome,
        expenses: dayExpenses,
        savings: daySavings,
        date: currentDay
      });
    }
    
    return weeklyData;
  };

  const getDefaultStatistics = () => {
    // Datos por defecto si no hay transacciones
    return [
      { day: 'Lunes', income: 0, expenses: 0, savings: 0 },
      { day: 'Martes', income: 0, expenses: 0, savings: 0 },
      { day: 'Miércoles', income: 0, expenses: 0, savings: 0 },
      { day: 'Jueves', income: 0, expenses: 0, savings: 0 },
      { day: 'Viernes', income: 0, expenses: 0, savings: 0 },
      { day: 'Sábado', income: 0, expenses: 0, savings: 0 },
      { day: 'Domingo', income: 0, expenses: 0, savings: 0 }
    ];
  };

  // Función para obtener hash de las transacciones (para optimización)
  const getTransactionsHash = (transactions) => {
    return JSON.stringify(transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      date: t.date
    })));
  };

  // Función optimizada para cargar estadísticas
  const loadStatisticsOptimized = (showMessage = false) => {
    try {
      setLoading(true);
      
      // Obtener transacciones del usuario
      const userTransactions = transactionService.getByUser(user.id);
      
      // Verificar si hay cambios significativos
      const currentHash = getTransactionsHash(userTransactions);
      const storedHash = localStorage.getItem(`stats_hash_${user.id}`);
      
      // Solo recalcular si hay cambios o es la primera vez
      if (currentHash !== storedHash || !lastUpdate) {
        // Obtener estadísticas por día de la semana
        const weeklyStats = getWeeklyStatistics(userTransactions);
        
        setStatistics(weeklyStats);
        setLastUpdate(new Date());
        
        // Guardar hash para futuras comparaciones
        localStorage.setItem(`stats_hash_${user.id}`, currentHash);
        
        if (showMessage) {
          setUpdateMessage('Estadísticas actualizadas correctamente');
          setTimeout(() => setUpdateMessage(''), 3000);
        }
      } else if (showMessage) {
        setUpdateMessage('Las estadísticas ya están actualizadas');
        setTimeout(() => setUpdateMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      // En caso de error, mostrar datos de ejemplo
      setStatistics(getDefaultStatistics());
      setUpdateMessage('Error al cargar estadísticas');
      setTimeout(() => setUpdateMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMaxValue = () => {
    if (statistics.length === 0) return 100000; // Valor por defecto más alto
    
    const maxIncome = Math.max(...statistics.map(s => s.income));
    const maxExpenses = Math.max(...statistics.map(s => s.expenses));
    const maxSavings = Math.max(...statistics.map(s => s.savings));
    const maxValue = Math.max(maxIncome, maxExpenses, maxSavings);
    
    // Si no hay datos, usar valor por defecto
    if (maxValue === 0) return 100000;
    
    // Redondear hacia arriba al siguiente múltiplo de 100,000 para mejor visualización
    return Math.ceil(maxValue / 100000) * 100000;
  };

  const getMinValue = () => {
    if (statistics.length === 0) return 0;
    
    const minIncome = Math.min(...statistics.map(s => s.income));
    const minExpenses = Math.min(...statistics.map(s => s.expenses));
    const minSavings = Math.min(...statistics.map(s => s.savings));
    const minValue = Math.min(minIncome, minExpenses, minSavings);
    
    // El valor mínimo no puede ser menor que 0
    return Math.max(minValue, 0);
  };

  const getYAxisLabels = () => {
    const max = getMaxValue();
    const min = getMinValue();
    const range = max - min;
    
    // Si no hay datos, usar valores por defecto
    if (range === 0) {
      return [0, 20000, 40000, 60000, 80000, 100000];
    }
    
    // Crear 6 puntos equidistantes desde min hasta max
    const step = range / 5;
    return Array.from({ length: 6 }, (_, i) => {
      const value = min + (i * step);
      // Redondear a múltiplos apropiados para mejor legibilidad
      if (value < 100000) {
        return Math.round(value / 10000) * 10000;
      } else if (value < 1000000) {
        return Math.round(value / 50000) * 50000;
      } else {
        return Math.round(value / 100000) * 100000;
      }
    });
  };

  const getYPosition = (value) => {
    const max = getMaxValue();
    const min = getMinValue();
    const range = max - min;
    
    // Si no hay rango o el valor está fuera del rango, manejar casos especiales
    if (range === 0) {
      // Si todos los valores son iguales, centrar en el medio
      return 50;
    }
    
    if (value < min) {
      // Si el valor está por debajo del mínimo, posicionar en la parte superior
      return 5;
    }
    
    if (value > max) {
      // Si el valor está por encima del máximo, posicionar en la parte inferior
      return 95;
    }
    
    // Cálculo correcto: valores más altos van hacia abajo (posición Y mayor)
    // El eje Y está invertido, así que valores grandes deben tener Y posiciones altas
    const normalizedValue = (value - min) / range;
    return 95 - (normalizedValue * 90); // 95 es la parte inferior, 5 es la superior
  };

  const getTotalIncome = () => {
    return statistics.reduce((sum, s) => sum + s.income, 0);
  };

  const getTotalExpenses = () => {
    return statistics.reduce((sum, s) => sum + s.expenses, 0);
  };

  const getTotalSavings = () => {
    return statistics.reduce((sum, s) => sum + s.savings, 0);
  };


  return (
    <div className="statistics-page">
      {/* Header Section */}
      <div className="statistics-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Revisa tus estadísticas con Oink</h1>
            <p>
              Visualiza de forma clara tus ingresos, gastos y ahorros para llevar un control más organizado y tomar mejores decisiones.
            </p>
            <button 
              className="refresh-btn"
              onClick={() => loadStatisticsOptimized(true)}
              disabled={loading}
            >
              <FaChartLine />
              {loading ? 'Actualizando...' : 'Actualizar Estadísticas'}
            </button>
          </div>
        </div>
      </div>

      {/* Update Message */}
      {updateMessage && (
        <div className="update-message">
          <span>{updateMessage}</span>
        </div>
      )}

      {/* Last Update Info */}
      {lastUpdate && (
        <div className="last-update-info">
          <FaCalendarAlt />
          <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      )}


      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-container">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando estadísticas...</p>
            </div>
          )}
          <div className="chart-content">
            {/* Chart Section */}
            <div className="chart-section">
              {/* Left Side - Chart */}
              <div className="chart-area">
                <div className="chart-wrapper">
                  <div className="chart-background">
                    {/* Y-Axis Labels */}
                    <div className="y-axis">
                      {getYAxisLabels().map((value, index) => (
                        <div key={index} className="y-label">
                          {value.toLocaleString()}
                        </div>
                      ))}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="x-axis">
                      {statistics.map((stat, index) => (
                        <div key={index} className="x-label">
                          {stat.day}
                        </div>
                      ))}
                    </div>

                    {/* Grid Lines */}
                    <div className="grid-lines">
                      {getYAxisLabels().map((_, index) => (
                        <div key={index} className="grid-line horizontal"></div>
                      ))}
                      {statistics.map((_, index) => (
                        <div key={index} className="grid-line vertical"></div>
                      ))}
                    </div>

                    {/* Chart Lines */}
                    <div className="chart-lines">
                      {/* Income Line (Orange) */}
                      <svg className="line-chart">
                        <polyline
                          fill="none"
                          stroke="#ff9800"
                          strokeWidth="3"
                          points={statistics.map((stat, index) => 
                            `${20 + (index * (320 / statistics.length))},${getYPosition(stat.income) + 20}`
                          ).join(' ')}
                        />
                        {statistics.map((stat, index) => (
                          <circle
                            key={index}
                            cx={20 + (index * (320 / statistics.length))}
                            cy={getYPosition(stat.income) + 20}
                            r="4"
                            fill="#ff9800"
                          />
                        ))}
                      </svg>

                      {/* Expenses Line (Red) */}
                      <svg className="line-chart">
                        <polyline
                          fill="none"
                          stroke="#f44336"
                          strokeWidth="3"
                          points={statistics.map((stat, index) => 
                            `${20 + (index * (320 / statistics.length))},${getYPosition(stat.expenses) + 20}`
                          ).join(' ')}
                        />
                        {statistics.map((stat, index) => (
                          <circle
                            key={index}
                            cx={20 + (index * (320 / statistics.length))}
                            cy={getYPosition(stat.expenses) + 20}
                            r="4"
                            fill="#f44336"
                          />
                        ))}
                      </svg>

                      {/* Savings Line (Green) */}
                      <svg className="line-chart">
                        <polyline
                          fill="none"
                          stroke="#4caf50"
                          strokeWidth="3"
                          points={statistics.map((stat, index) => 
                            `${20 + (index * (320 / statistics.length))},${getYPosition(stat.savings) + 20}`
                          ).join(' ')}
                        />
                        {statistics.map((stat, index) => (
                          <circle
                            key={index}
                            cx={20 + (index * (320 / statistics.length))}
                            cy={getYPosition(stat.savings) + 20}
                            r="4"
                            fill="#4caf50"
                          />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Legend and Character */}
              <div className="chart-sidebar">
                {/* Legend */}
                <div className="legend">
                  <h3>Leyenda</h3>
                  <div className="legend-items">
                    <div className="legend-item">
                      <div className="legend-color income"></div>
                      <span>Ingresos</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color expenses"></div>
                      <span>Gastos</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color savings"></div>
                      <span>Ahorros</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards - Now below the chart */}
            <div className="summary-cards">
              <div className="summary-card income">
                <div className="card-icon">
                  <FaArrowUp />
                </div>
                <div className="card-content">
                  <h4>Ingresos</h4>
                  <p>{formatCurrency(getTotalIncome())}</p>
                </div>
              </div>

              <div className="summary-card expenses">
                <div className="card-icon">
                  <FaArrowDown />
                </div>
                <div className="card-content">
                  <h4>Gastos</h4>
                  <p>{formatCurrency(getTotalExpenses())}</p>
                </div>
              </div>

              <div className="summary-card savings">
                <div className="card-icon">
                  <FaPiggyBank />
                </div>
                <div className="card-content">
                  <h4>Ahorros</h4>
                  <p>{formatCurrency(getTotalSavings())}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pig Image */}
          <div className="pig-image-container">
            <img 
              src={pigImage} 
              alt="Cerdo Oink con Estadísticas" 
              className="pig-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
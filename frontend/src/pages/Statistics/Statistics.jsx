import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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

  useEffect(() => {
    if (user?.id) {
      loadStatistics();
    }
  }, [user]);

  useEffect(() => {
    // Agregar clase al body cuando se monta el componente
    document.body.classList.add('statistics-page-active');
    
    // Limpiar clase del body cuando se desmonta el componente
    return () => {
      document.body.classList.remove('statistics-page-active');
    };
  }, []);

  const loadStatistics = () => {
    try {
      // Datos de estadísticas basados en el diseño proporcionado
      const mockStatistics = [
        {
          day: 'Lunes',
          income: 10000,
          expenses: 5000,
          savings: 5000
        },
        {
          day: 'Martes',
          income: 15000,
          expenses: 8000,
          savings: 7000
        },
        {
          day: 'Miércoles',
          income: 25000,
          expenses: 12000,
          savings: 13000
        },
        {
          day: 'Jueves',
          income: 30000,
          expenses: 15000,
          savings: 15000
        },
        {
          day: 'Viernes',
          income: 35000,
          expenses: 18000,
          savings: 17000
        },
        {
          day: 'Sábado',
          income: 40000,
          expenses: 22000,
          savings: 18000
        },
        {
          day: 'Domingo',
          income: 45000,
          expenses: 25000,
          savings: 20000
        }
      ];
      
      setStatistics(mockStatistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
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
    const maxIncome = Math.max(...statistics.map(s => s.income));
    const maxExpenses = Math.max(...statistics.map(s => s.expenses));
    const maxSavings = Math.max(...statistics.map(s => s.savings));
    return Math.max(maxIncome, maxExpenses, maxSavings);
  };

  const getYAxisLabels = () => {
    const max = getMaxValue();
    const step = Math.ceil(max / 5 / 10000) * 10000; // Redondear a múltiplos de 10,000
    return Array.from({ length: 6 }, (_, i) => i * step);
  };

  const getYPosition = (value) => {
    const max = getMaxValue();
    return ((max - value) / max) * 100;
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
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-container">
          <div className="chart-content">
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

              {/* Summary Cards */}
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
          </div>

          {/* Pig Character */}
          <div className="pig-character">
            <div className="pig-body">
              <div className="pig-face">
                <div className="pig-eyes">
                  <div className="eye left"></div>
                  <div className="eye right"></div>
                </div>
                <div className="pig-nose"></div>
                <div className="pig-mouth"></div>
                <div className="pig-cheeks"></div>
              </div>
              <div className="pig-glasses"></div>
              <div className="pig-hat"></div>
              <div className="pig-document">
                <div className="document-content">
                  <div className="mini-chart">
                    <div className="mini-bar income-bar"></div>
                    <div className="mini-bar expenses-bar"></div>
                    <div className="mini-bar savings-bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
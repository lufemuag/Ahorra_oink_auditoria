import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBook,
  FaLightbulb,
  FaChartLine,
  FaPiggyBank,
  FaBullseye,
  FaCalculator,
  FaUsers,
  FaCheckCircle,
  FaPlay
} from 'react-icons/fa';
import './Methodologies.css';

const Methodologies = () => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const methodologies = [
    {
      id: '50-30-20',
      name: 'Regla 50/30/20',
      description: 'Distribuye tus ingresos en necesidades, deseos y ahorros',
      icon: FaChartLine,
      difficulty: 'Fácil',
      timeCommitment: '5 min/día',
      category: 'Presupuesto',
      color: '#3498db'
    },
    {
      id: 'zero-based',
      name: 'Presupuesto Base Cero',
      description: 'Asigna cada peso a una categoría específica',
      icon: FaCalculator,
      difficulty: 'Intermedio',
      timeCommitment: '15 min/semana',
      category: 'Presupuesto',
      color: '#e74c3c'
    },
    {
      id: 'envelope',
      name: 'Método de Sobres',
      description: 'Asigna dinero en efectivo a categorías específicas',
      icon: FaPiggyBank,
      difficulty: 'Fácil',
      timeCommitment: '10 min/semana',
      category: 'Control de gastos',
      color: '#f39c12'
    },
    {
      id: 'snowball',
      name: 'Método Bola de Nieve',
      description: 'Paga deudas empezando por la más pequeña',
      icon: FaBullseye,
      difficulty: 'Fácil',
      timeCommitment: '5 min/día',
      category: 'Pago de deudas',
      color: '#2ecc71'
    },
    {
      id: 'pay-yourself-first',
      name: 'Págate a Ti Mismo Primero',
      description: 'Ahorra antes de gastar en otras cosas',
      icon: FaUsers,
      difficulty: 'Fácil',
      timeCommitment: '2 min/día',
      category: 'Ahorro',
      color: '#9b59b6'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil':
        return '#2ecc71';
      case 'Intermedio':
        return '#f39c12';
      case 'Avanzado':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="methodologies">
      <div className="methodologies-header">
        <h1>📚 Metodologías Financieras</h1>
        <p>Aprende y aplica las mejores estrategias para manejar tus finanzas personales</p>
      </div>

      <div className="methodologies-content">
        <div className="methodologies-grid">
          {methodologies.map((method) => {
            const Icon = method.icon;
            return (
              <div 
                key={method.id} 
                className="methodology-card"
                onClick={() => setSelectedMethod(method)}
              >
                <div className="methodology-header">
                  <div className="methodology-icon" style={{ backgroundColor: method.color }}>
                    <Icon />
                  </div>
                  <div className="methodology-meta">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(method.difficulty) }}
                    >
                      {method.difficulty}
                    </span>
                    <span className="time-badge">{method.timeCommitment}</span>
                  </div>
                </div>

                <div className="methodology-info">
                  <h3>{method.name}</h3>
                  <p>{method.description}</p>
                  <div className="methodology-category">{method.category}</div>
                </div>

                <button className="learn-more-btn">
                  <FaPlay />
                  Aprender Más
                </button>
              </div>
            );
          })}
        </div>

        {selectedMethod && (
          <div className="methodology-detail">
            <div className="detail-header">
              <div className="detail-title">
                <div 
                  className="detail-icon"
                  style={{ backgroundColor: selectedMethod.color }}
                >
                  <selectedMethod.icon />
                </div>
                <div>
                  <h2>{selectedMethod.name}</h2>
                  <p>{selectedMethod.description}</p>
                </div>
              </div>
              <button 
                className="close-detail"
                onClick={() => setSelectedMethod(null)}
              >
                ×
              </button>
            </div>

            <div className="detail-content">
              <div className="tab-content">
                <div className="overview-section">
                  <h3>Descripción</h3>
                  <p>Esta metodología te ayudará a organizar tus finanzas de manera efectiva.</p>
                </div>
                
                <div className="benefits-section">
                  <h3>Beneficios</h3>
                  <ul>
                    <li>
                      <FaCheckCircle className="benefit-icon" />
                      Mejora tu organización financiera
                    </li>
                    <li>
                      <FaCheckCircle className="benefit-icon" />
                      Te ayuda a alcanzar tus metas
                    </li>
                    <li>
                      <FaCheckCircle className="benefit-icon" />
                      Reduce el estrés financiero
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Methodologies;
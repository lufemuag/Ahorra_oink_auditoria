import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPiggyBank, FaEnvelope, FaRobot, FaDollarSign, FaCalculator } from 'react-icons/fa';
import pigImage from '../../assets/cerdo.png';
import './Methods.css';

const Methods = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Agregar clase para el layout específico
    document.body.classList.add('methods-page-active');
    
    return () => {
      document.body.classList.remove('methods-page-active');
    };
  }, []);

  const methods = [
    {
      id: '50-30-20',
      title: 'Método 50:30:20',
      description: 'Distribuye tu dinero en 50% necesidades, 30% deseos y 20% ahorro',
      icon: FaCalculator,
      color: '#ff9800',
      route: '/metodo-50-30-20'
    },
    {
      id: 'sobres',
      title: 'Método de Sobres',
      description: 'Organiza tu dinero en sobres físicos para cada categoría',
      icon: FaEnvelope,
      color: '#4caf50',
      route: '/metodo-sobres'
    },
    {
      id: 'automatico',
      title: 'Ahorro Automático',
      description: 'Configura transferencias automáticas a tu cuenta de ahorros',
      icon: FaRobot,
      color: '#2196f3',
      route: '/ahorro-automatico'
    },
    {
      id: '1dolar',
      title: 'Ahorro del $1',
      description: 'Ahorra $1 cada día y ve cómo crece tu dinero progresivamente',
      icon: FaDollarSign,
      color: '#9c27b0',
      route: '/ahorro-1dolar'
    },
    {
      id: 'redondeo',
      title: 'Método del Redondeo',
      description: 'Redondea tus gastos y ahorra la diferencia automáticamente',
      icon: FaPiggyBank,
      color: '#f44336',
      route: '/metodo-redondeo'
    }
  ];

  const handleMethodClick = (route) => {
    navigate(route);
  };

  return (
    <div className="methods-page">
      {/* Header Section */}
      <div className="methods-header">
        <div className="header-content">
          <div className="header-text">
            <h1>¡Elige tu método de ahorro!</h1>
            <p>Selecciona el método que mejor se adapte a tu estilo de vida y comienza a ahorrar de manera inteligente.</p>
          </div>
          <div className="pig-image-container">
            <img 
              src={pigImage} 
              alt="Cerdo Oink" 
              className="pig-image"
            />
          </div>
        </div>
      </div>

      {/* Methods Section */}
      <div className="methods-section">
        <div className="methods-container">
          <div className="methods-grid">
            {methods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div 
                  key={method.id}
                  className="method-card"
                  onClick={() => handleMethodClick(method.route)}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <div className="card-icon" style={{ backgroundColor: `${method.color}20`, color: method.color }}>
                        <IconComponent />
                      </div>
                      <h3>{method.title}</h3>
                    </div>
                    <div className="card-back">
                      <div className="card-description">
                        <p>{method.description}</p>
                        <div className="card-action">
                          <span>Haz clic para comenzar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methods;

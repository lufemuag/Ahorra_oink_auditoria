import React, { useEffect, useState } from 'react';
import { useMoney } from '../../context/MoneyContext';
import { FaArrowLeft, FaCalculator, FaHome, FaHeart, FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Method50-30-20.css';

const Method50_30_20 = () => {
  const { totalAmount } = useMoney();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Agregar clase para el layout específico
    document.body.classList.add('method-page-active');
    
    return () => {
      document.body.classList.remove('method-page-active');
    };
  }, []);

  useEffect(() => {
    if (totalAmount > 0) {
      setAmount(totalAmount);
    } else {
      // Si no hay monto guardado, redirigir al dashboard
      navigate('/');
    }
  }, [totalAmount, navigate]);

  // Cálculos del método 50:30:20
  const necessities = amount * 0.5; // 50% necesidades
  const wants = amount * 0.3; // 30% deseos
  const savings = amount * 0.2; // 20% ahorro

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleGoBack = () => {
    navigate('/metodos');
  };

  const distribution = [
    {
      category: 'Necesidades',
      amount: necessities,
      percentage: '50%',
      icon: FaHome,
      color: '#4caf50',
      description: 'Gastos esenciales como vivienda, comida, transporte, servicios básicos'
    },
    {
      category: 'Deseos',
      amount: wants,
      percentage: '30%',
      icon: FaHeart,
      color: '#ff9800',
      description: 'Gastos no esenciales como entretenimiento, ropa, restaurantes'
    },
    {
      category: 'Ahorro',
      amount: savings,
      percentage: '20%',
      icon: FaPiggyBank,
      color: '#2196f3',
      description: 'Dinero para emergencias, inversiones y metas futuras'
    }
  ];

  return (
    <div className="method-page">
      {/* Header Section */}
      <div className="method-header">
        <div className="header-content">
          <button onClick={handleGoBack} className="back-button">
            <FaArrowLeft />
            <span>Volver a Métodos</span>
          </button>
          <div className="method-title">
            <div className="title-icon">
              <FaCalculator />
            </div>
            <div className="title-text">
              <h1>Método 50:30:20</h1>
              <p>Distribuye tu dinero de manera equilibrada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="amount-section">
        <div className="amount-container">
          <div className="amount-card">
            <h2>Monto Total</h2>
            <div className="amount-value">{formatCurrency(amount)}</div>
            <p>Este es tu presupuesto mensual disponible</p>
          </div>
        </div>
      </div>

      {/* Distribution Section */}
      <div className="distribution-section">
        <div className="distribution-container">
          <h2>Distribución de tu Presupuesto</h2>
          <div className="distribution-table">
            <div className="table-header">
              <div className="header-cell category">Categoría</div>
              <div className="header-cell percentage">Porcentaje</div>
              <div className="header-cell amount">Monto</div>
            </div>
            <div className="table-body">
              {distribution.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="table-row">
                    <div className="cell category-cell">
                      <div className="category-info">
                        <div className="category-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                          <IconComponent />
                        </div>
                        <div className="category-details">
                          <span className="category-name">{item.category}</span>
                          <span className="category-desc">{item.description}</span>
                        </div>
                      </div>
                    </div>
                    <div className="cell percentage-cell">
                      <span className="percentage-value" style={{ color: item.color }}>
                        {item.percentage}
                      </span>
                    </div>
                    <div className="cell amount-cell">
                      <span className="amount-value" style={{ color: item.color }}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="table-row total-row">
                <div className="cell category-cell">
                  <span className="total-label">Total</span>
                </div>
                <div className="cell percentage-cell">
                  <span className="total-percentage">100%</span>
                </div>
                <div className="cell amount-cell">
                  <span className="total-amount">{formatCurrency(amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pig Image */}
      <div className="pig-image-container">
        <img 
          src="/src/assets/pig.png" 
          alt="Cerdo Oink" 
          className="pig-image"
        />
      </div>
    </div>
  );
};

export default Method50_30_20;

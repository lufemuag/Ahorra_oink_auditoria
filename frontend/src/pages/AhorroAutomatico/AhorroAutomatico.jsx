import React, { useEffect, useState } from 'react';
import { useMoney } from '../../context/MoneyContext';
import { FaArrowLeft, FaRobot, FaPiggyBank, FaCalendarAlt, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AhorroAutomatico.css';

const AhorroAutomatico = () => {
  const { totalAmount } = useMoney();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    document.body.classList.add('method-page-active');
    return () => {
      document.body.classList.remove('method-page-active');
    };
  }, []);

  useEffect(() => {
    if (totalAmount > 0) {
      setAmount(totalAmount);
    } else {
      navigate('/');
    }
  }, [totalAmount, navigate]);

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

  const automaticSavings = amount * 0.2; // 20% para ahorro automático
  const availableAmount = amount - automaticSavings;

  const scheduleOptions = [
    { period: 'Diario', amount: automaticSavings / 30, description: 'Transferencia diaria' },
    { period: 'Semanal', amount: automaticSavings / 4, description: 'Transferencia semanal' },
    { period: 'Quincenal', amount: automaticSavings / 2, description: 'Transferencia quincenal' },
    { period: 'Mensual', amount: automaticSavings, description: 'Transferencia mensual' }
  ];

  return (
    <div className="method-page">
      <div className="method-header">
        <div className="header-content">
          <button onClick={handleGoBack} className="back-button">
            <FaArrowLeft />
            <span>Volver a Métodos</span>
          </button>
          <div className="method-title">
            <div className="title-icon">
              <FaRobot />
            </div>
            <div className="title-text">
              <h1>Ahorro Automático</h1>
              <p>Configura transferencias automáticas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="amount-section">
        <div className="amount-container">
          <div className="amount-card">
            <h2>Monto Total</h2>
            <div className="amount-value">{formatCurrency(amount)}</div>
            <p>Tu presupuesto mensual disponible</p>
          </div>
        </div>
      </div>

      <div className="automatic-section">
        <div className="automatic-container">
          <h2>Configuración de Ahorro Automático</h2>
          
          <div className="savings-summary">
            <div className="summary-card">
              <div className="card-icon">
                <FaPiggyBank />
              </div>
              <div className="card-content">
                <h3>Ahorro Automático</h3>
                <p className="amount" style={{ color: '#4caf50' }}>
                  {formatCurrency(automaticSavings)}
                </p>
                <p className="description">20% de tu presupuesto</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="card-icon">
                <FaCalendarAlt />
              </div>
              <div className="card-content">
                <h3>Disponible</h3>
                <p className="amount" style={{ color: '#ff9800' }}>
                  {formatCurrency(availableAmount)}
                </p>
                <p className="description">80% para gastos</p>
              </div>
            </div>
          </div>

          <div className="schedule-options">
            <h3>Opciones de Programación</h3>
            <div className="options-grid">
              {scheduleOptions.map((option, index) => (
                <div key={index} className="option-card">
                  <div className="option-period">{option.period}</div>
                  <div className="option-amount">{formatCurrency(option.amount)}</div>
                  <div className="option-desc">{option.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

export default AhorroAutomatico;

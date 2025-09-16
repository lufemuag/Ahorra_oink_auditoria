import React, { useEffect, useState } from 'react';
import { useMoney } from '../../context/MoneyContext';
import { FaArrowLeft, FaDollarSign, FaCalendarDay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Ahorro1Dolar.css';

const Ahorro1Dolar = () => {
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

  // Ahorro del $1 diario por 30 días
  const dailySavings = 1; // $1 diario
  const monthlySavings = dailySavings * 30; // $30 mensual
  const yearlySavings = dailySavings * 365; // $365 anual

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
              <FaDollarSign />
            </div>
            <div className="title-text">
              <h1>Ahorro del $1</h1>
              <p>Ahorra $1 cada día y ve crecer tu dinero</p>
            </div>
          </div>
        </div>
      </div>

      <div className="amount-section">
        <div className="amount-container">
          <div className="amount-card">
            <h2>Tu Presupuesto</h2>
            <div className="amount-value">{formatCurrency(amount)}</div>
            <p>Presupuesto mensual disponible</p>
          </div>
        </div>
      </div>

      <div className="dollar-savings-section">
        <div className="dollar-savings-container">
          <h2>Progreso del Ahorro del $1</h2>
          
          <div className="savings-cards">
            <div className="savings-card daily">
              <div className="card-icon">
                <FaDollarSign />
              </div>
              <div className="card-content">
                <h3>Ahorro Diario</h3>
                <p className="amount">{formatCurrency(dailySavings)}</p>
                <p className="description">Cada día</p>
              </div>
            </div>
            
            <div className="savings-card monthly">
              <div className="card-icon">
                <FaCalendarDay />
              </div>
              <div className="card-content">
                <h3>Ahorro Mensual</h3>
                <p className="amount">{formatCurrency(monthlySavings)}</p>
                <p className="description">En 30 días</p>
              </div>
            </div>
            
            <div className="savings-card yearly">
              <div className="card-icon">
                <FaDollarSign />
              </div>
              <div className="card-content">
                <h3>Ahorro Anual</h3>
                <p className="amount">{formatCurrency(yearlySavings)}</p>
                <p className="description">En 365 días</p>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <h3>¡Cada día cuenta!</h3>
            <p>El método del $1 diario te ayuda a crear el hábito de ahorrar de manera constante y sin esfuerzo.</p>
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

export default Ahorro1Dolar;

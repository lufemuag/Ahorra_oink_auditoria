import React, { useEffect, useState } from 'react';
import { useMoney } from '../../context/MoneyContext';
import { FaArrowLeft, FaEnvelope, FaHome, FaHeart, FaPiggyBank, FaUtensils, FaCar, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MethodSobres.css';

const MethodSobres = () => {
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

  const envelopes = [
    {
      category: 'Vivienda',
      amount: amount * 0.35,
      icon: FaHome,
      color: '#4caf50',
      description: 'Alquiler, servicios, mantenimiento'
    },
    {
      category: 'Alimentación',
      amount: amount * 0.25,
      icon: FaUtensils,
      color: '#ff9800',
      description: 'Supermercado, restaurantes básicos'
    },
    {
      category: 'Transporte',
      amount: amount * 0.15,
      icon: FaCar,
      color: '#2196f3',
      description: 'Gasolina, transporte público'
    },
    {
      category: 'Entretenimiento',
      amount: amount * 0.10,
      icon: FaGamepad,
      color: '#9c27b0',
      description: 'Diversión, hobbies, salidas'
    },
    {
      category: 'Ahorro',
      amount: amount * 0.15,
      icon: FaPiggyBank,
      color: '#f44336',
      description: 'Emergencias, metas futuras'
    }
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
              <FaEnvelope />
            </div>
            <div className="title-text">
              <h1>Método de Sobres</h1>
              <p>Organiza tu dinero en sobres físicos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="amount-section">
        <div className="amount-container">
          <div className="amount-card">
            <h2>Monto Total</h2>
            <div className="amount-value">{formatCurrency(amount)}</div>
            <p>Divide este monto en sobres físicos</p>
          </div>
        </div>
      </div>

      <div className="envelopes-section">
        <div className="envelopes-container">
          <h2>Distribución en Sobres</h2>
          <div className="envelopes-grid">
            {envelopes.map((envelope, index) => {
              const IconComponent = envelope.icon;
              return (
                <div key={index} className="envelope-card">
                  <div className="envelope-icon" style={{ backgroundColor: `${envelope.color}20`, color: envelope.color }}>
                    <IconComponent />
                  </div>
                  <h3>{envelope.category}</h3>
                  <p className="envelope-amount" style={{ color: envelope.color }}>
                    {formatCurrency(envelope.amount)}
                  </p>
                  <p className="envelope-desc">{envelope.description}</p>
                </div>
              );
            })}
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

export default MethodSobres;

import React, { useEffect, useState } from 'react';
import { useMoney } from '../../context/MoneyContext';
import { FaArrowLeft, FaPiggyBank, FaCalculator, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MetodoRedondeo.css';

const MetodoRedondeo = () => {
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

  // Ejemplo de redondeo: si gastas $1,234, redondeas a $1,300 y ahorras $66
  const exampleSpending = 1234;
  const roundedAmount = Math.ceil(exampleSpending / 100) * 100; // Redondea hacia arriba a la centena más cercana
  const savingsFromRounding = roundedAmount - exampleSpending;

  // Estimación de ahorro mensual con el método del redondeo
  const estimatedMonthlySavings = amount * 0.05; // 5% estimado del presupuesto

  const roundingExamples = [
    {
      original: 1234,
      rounded: 1300,
      savings: 66,
      description: 'Gasto de $1,234 → Redondeo a $1,300 → Ahorro: $66'
    },
    {
      original: 567,
      rounded: 600,
      savings: 33,
      description: 'Gasto de $567 → Redondeo a $600 → Ahorro: $33'
    },
    {
      original: 2890,
      rounded: 2900,
      savings: 10,
      description: 'Gasto de $2,890 → Redondeo a $2,900 → Ahorro: $10'
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
              <FaPiggyBank />
            </div>
            <div className="title-text">
              <h1>Método del Redondeo</h1>
              <p>Redondea tus gastos y ahorra la diferencia</p>
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

      <div className="rounding-section">
        <div className="rounding-container">
          <h2>¿Cómo Funciona el Redondeo?</h2>
          
          <div className="explanation-card">
            <div className="explanation-content">
              <h3>Redondea hacia arriba</h3>
              <p>Cuando hagas un gasto, redondea la cantidad hacia arriba al número entero más cercano y ahorra la diferencia.</p>
            </div>
          </div>

          <div className="examples-section">
            <h3>Ejemplos de Redondeo</h3>
            <div className="examples-grid">
              {roundingExamples.map((example, index) => (
                <div key={index} className="example-card">
                  <div className="example-header">
                    <span className="example-number">Ejemplo {index + 1}</span>
                  </div>
                  <div className="example-amounts">
                    <div className="original-amount">
                      <span className="label">Gasto original:</span>
                      <span className="amount">{formatCurrency(example.original)}</span>
                    </div>
                    <FaArrowUp className="arrow-icon" />
                    <div className="rounded-amount">
                      <span className="label">Redondeado a:</span>
                      <span className="amount">{formatCurrency(example.rounded)}</span>
                    </div>
                    <div className="savings-amount">
                      <span className="label">Ahorro:</span>
                      <span className="amount savings">{formatCurrency(example.savings)}</span>
                    </div>
                  </div>
                  <p className="example-desc">{example.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="estimated-savings">
            <div className="savings-card">
              <div className="card-icon">
                <FaCalculator />
              </div>
              <div className="card-content">
                <h3>Ahorro Estimado Mensual</h3>
                <p className="amount">{formatCurrency(estimatedMonthlySavings)}</p>
                <p className="description">Basado en tu presupuesto mensual</p>
              </div>
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

export default MetodoRedondeo;

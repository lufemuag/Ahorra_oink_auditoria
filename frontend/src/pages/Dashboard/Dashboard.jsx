import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMoney } from '../../context/MoneyContext';
import { useNavigate } from 'react-router-dom';
import { FaPiggyBank, FaDollarSign } from 'react-icons/fa';
import pigImage from '../../assets/cerdoMoneda.png';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { setUserAmount } = useMoney();
  const navigate = useNavigate();
  const [salary, setSalary] = useState('');

  const handleSalarySubmit = (e) => {
    e.preventDefault();
    if (salary.trim()) {
      // Convertir el salario a número y guardarlo en el contexto
      const salaryAmount = parseFloat(salary.replace(/[^\d.-]/g, ''));
      if (salaryAmount > 0) {
        setUserAmount(salaryAmount);
        // Redirigir a la página de métodos
        navigate('/metodos');
      }
    }
  };

  const handleStartSaving = () => {
    if (salary.trim()) {
      const salaryAmount = parseFloat(salary.replace(/[^\d.-]/g, ''));
      if (salaryAmount > 0) {
        setUserAmount(salaryAmount);
        navigate('/metodos');
      }
    }
  };

  return (
    <div className="dashboard-landing">
      {/* Main Content - sin header duplicado */}
      <div className="landing-main">
        <div className="main-panel">
          <div className="panel-content">
            {/* Left side - Pig Image */}
            <div className="pig-image-section">
              <img 
                src={pigImage} 
                alt="Cerdo Oink Sentado" 
                className="pig-image"
              />
            </div>

            {/* Right side - Text and actions */}
            <div className="content-section">
              <div className="welcome-text">
                <h1>Ingresa tu salario o ingresos y Oink</h1>
                <h2>te ayudará a ahorrar mejor.</h2>
              </div>

              <form onSubmit={handleSalarySubmit} className="salary-form">
                <div className="salary-input-container">
                  <FaDollarSign className="dollar-icon" />
                  <input
                    type="text"
                    placeholder="Ej: $20.000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="salary-input"
                  />
                </div>
                <button 
                  type="submit" 
                  className="start-saving-btn"
                  onClick={handleStartSaving}
                >
                  ¡Comenzar a ahorrar!
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
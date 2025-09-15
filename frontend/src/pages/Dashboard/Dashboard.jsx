import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPiggyBank, FaDollarSign } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [salary, setSalary] = useState('');

  const handleSalarySubmit = (e) => {
    e.preventDefault();
    if (salary.trim()) {
      // Aquí podrías guardar el salario o redirigir a alguna página
      console.log('Salario ingresado:', salary);
      // Por ahora, redirigimos a la página de logros como ejemplo
      navigate('/achievements');
    }
  };

  const handleStartSaving = () => {
    navigate('/achievements');
  };

  return (
    <div className="dashboard-landing">
      {/* Main Content - sin header duplicado */}
      <div className="landing-main">
        <div className="main-panel">
          <div className="panel-content">
            {/* Left side - Pig character */}
            <div className="pig-section">
              <div className="pig-character">
                <div className="pig-body">
                  <div className="pig-head">
                    <div className="pig-eyes">
                      <div className="eye left"></div>
                      <div className="eye right"></div>
                    </div>
                    <div className="pig-nose"></div>
                    <div className="pig-ears">
                      <div className="ear left"></div>
                      <div className="ear right"></div>
                    </div>
                  </div>
                  <div className="pig-hat"></div>
                  <div className="pig-bowtie"></div>
                </div>
                <div className="armchair">
                  <div className="chair-back"></div>
                  <div className="chair-seat"></div>
                  <div className="chair-arms">
                    <div className="arm left"></div>
                    <div className="arm right"></div>
                  </div>
                  <div className="chair-legs">
                    <div className="leg left"></div>
                    <div className="leg right"></div>
                  </div>
                </div>
                <div className="piggy-bank">
                  <div className="bank-body"></div>
                  <div className="bank-face">
                    <div className="bank-eyes">
                      <div className="bank-eye left"></div>
                      <div className="bank-eye right"></div>
                    </div>
                    <div className="bank-nose"></div>
                    <div className="bank-smile"></div>
                  </div>
                  <div className="bank-slot"></div>
                </div>
              </div>
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
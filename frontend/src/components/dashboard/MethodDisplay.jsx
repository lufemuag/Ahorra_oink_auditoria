// src/components/dashboard/MethodDisplay.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { savingsMethodService } from '../../services/savingsMethodService';
import { FaCalculator, FaEnvelope, FaRobot, FaDollarSign, FaPiggyBank, FaInfoCircle } from 'react-icons/fa';
import './MethodDisplay.css';

const MethodDisplay = () => {
  const { user } = useAuth();
  const [methodData, setMethodData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMethodData();
  }, []);

  const loadMethodData = async () => {
    try {
      const result = await savingsMethodService.getCurrentMethod();
      if (result.success && result.data) {
        setMethodData(result.data);
      }
    } catch (error) {
      console.error('Error cargando método de ahorro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (method) => {
    const icons = {
      '50-30-20': FaCalculator,
      'sobres': FaEnvelope,
      'automatico': FaRobot,
      '1dolar': FaDollarSign,
      'redondeo': FaPiggyBank
    };
    return icons[method] || FaPiggyBank;
  };

  const getMethodName = (method) => {
    const names = {
      '50-30-20': 'Método 50:30:20',
      'sobres': 'Método de Sobres',
      'automatico': 'Ahorro Automático',
      '1dolar': 'Ahorro del $1',
      'redondeo': 'Método del Redondeo'
    };
    return names[method] || method;
  };

  const getMethodDescription = (method) => {
    const descriptions = {
      '50-30-20': 'Distribuye tu dinero en 50% necesidades, 30% deseos y 20% ahorro',
      'sobres': 'Organiza tu dinero en sobres físicos para cada categoría',
      'automatico': 'Configura transferencias automáticas a tu cuenta de ahorros',
      '1dolar': 'Ahorra $1 cada día y ve cómo crece tu dinero progresivamente',
      'redondeo': 'Redondea tus gastos y ahorra la diferencia automáticamente'
    };
    return descriptions[method] || 'Método de ahorro personalizado';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="method-display-loading">
        <div className="loader"></div>
        <p>Cargando método de ahorro...</p>
      </div>
    );
  }

  if (!methodData || !methodData.method) {
    return (
      <div className="method-display-empty">
        <div className="empty-icon">
          <FaInfoCircle />
        </div>
        <h3>No has seleccionado un método de ahorro</h3>
        <p>Ve a la sección de métodos para elegir tu estrategia de ahorro preferida.</p>
      </div>
    );
  }

  const IconComponent = getMethodIcon(methodData.method);

  return (
    <div className="method-display">
      <div className="method-header">
        <div className="method-icon">
          <IconComponent />
        </div>
        <div className="method-info">
          <h3 className="method-name">{getMethodName(methodData.method)}</h3>
          <p className="method-description">{getMethodDescription(methodData.method)}</p>
        </div>
      </div>
      
      <div className="method-details">
        {methodData.monthly_income && (
          <div className="detail-item">
            <span className="detail-label">Ingreso mensual:</span>
            <span className="detail-value">{formatCurrency(methodData.monthly_income)}</span>
          </div>
        )}
        
        {methodData.selected_at && (
          <div className="detail-item">
            <span className="detail-label">Seleccionado el:</span>
            <span className="detail-value">
              {new Date(methodData.selected_at).toLocaleDateString('es-CO')}
            </span>
          </div>
        )}
        
        {!methodData.can_change && methodData.days_until_change > 0 && (
          <div className="detail-item warning">
            <span className="detail-label">Puedes cambiar en:</span>
            <span className="detail-value">{methodData.days_until_change} días</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MethodDisplay;

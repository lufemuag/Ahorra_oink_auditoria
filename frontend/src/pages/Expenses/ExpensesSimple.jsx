import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSearch,
  FaChartPie,
  FaCalendarAlt,
  FaTag,
  FaDollarSign
} from 'react-icons/fa';
import './Expenses.css';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = () => {
    try {
      // Datos de prueba
      const mockExpenses = [
        {
          id: 1,
          description: 'Almuerzo',
          category: 'Alimentación',
          amount: 15000,
          date: new Date().toISOString()
        },
        {
          id: 2,
          description: 'Transporte',
          category: 'Transporte',
          amount: 5000,
          date: new Date().toISOString()
        }
      ];
      setExpenses(mockExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="expenses">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando gastos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expenses">
      <div className="expenses-header">
        <div className="header-content">
          <h1>💸 Mis Gastos</h1>
          <p>Gestiona y analiza tus gastos personales</p>
        </div>
        <button className="add-expense-btn">
          <FaPlus />
          Agregar Gasto
        </button>
      </div>

      <div className="expenses-content">
        <div className="expenses-list">
          <h2>Historial de Gastos</h2>
          
          {expenses.length === 0 ? (
            <div className="empty-state">
              <FaTag className="empty-icon" />
              <h3>No hay gastos</h3>
              <p>Agrega tu primer gasto para comenzar a llevar un control</p>
            </div>
          ) : (
            <div className="expenses-grid">
              {expenses.map((expense) => (
                <div key={expense.id} className="expense-card">
                  <div className="expense-icon">
                    <span>💰</span>
                  </div>
                  
                  <div className="expense-info">
                    <h3 className="expense-description">{expense.description}</h3>
                    <p className="expense-category">{expense.category}</p>
                    <p className="expense-date">
                      {new Date(expense.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div className="expense-amount">
                    <span className="amount">-${expense.amount.toLocaleString()}</span>
                  </div>

                  <div className="expense-actions">
                    <button className="action-btn edit-btn" title="Editar gasto">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete-btn" title="Eliminar gasto">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;

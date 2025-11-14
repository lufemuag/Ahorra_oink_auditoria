import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMoney } from '../../context/MoneyContext';
import { transactionService } from '../../services/transactionService';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTag,
  FaDollarSign,
  FaReceipt,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaPiggyBank,
  FaCalendarAlt
} from 'react-icons/fa';
import pigHead from '../../assets/cabeza.png';
import './Expenses.css';
import { triggerAchievementsRefresh } from '../../utils/achievements';

const Expenses = () => {
  const { user } = useAuth();
  const { totalAmount } = useMoney();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);

  const defaultCategories = {
    expense: ['Alimentación','Transporte','Entretenimiento','Salud','Educación','Vivienda','Otros'],
    income: ['Salario','Freelance','Inversiones','Ventas','Bonificaciones','Otros ingresos'],
    savings: ['Fondo de emergencia','Vacaciones','Casa','Coche','Retiro','Otros ahorros']
  };

  useEffect(() => {
    loadTransactions();
    loadCategories();
    loadCurrentBalance();
    
    const now = new Date();
    const colombiaDate = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    const todayString = colombiaDate.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      date: todayString
    }));
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadCurrentBalance();
    }
  }, [user?.id, totalAmount]);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await transactionService.getTransactions();
      if (result.success) {
        setTransactions(result.transactions || []);
      } else {
        setError(result.error || 'Error al cargar transacciones');
      }
    } catch (err) {
      console.error('Error cargando transacciones:', err);
      setError('Error de conexión al cargar transacciones. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await transactionService.getCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const loadCurrentBalance = async () => {
    try {
      console.log('=== CARGANDO BALANCE EN PÁGINA DE GASTOS ===');
      const authData = localStorage.getItem('ahorra_oink_auth');
      if (!authData) {
        console.log('No hay datos de autenticación');
        return;
      }
      
      const session = JSON.parse(authData);
      const token = session.token;
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      
      const response = await fetch('http://localhost:8000/api/auth/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Datos del usuario recibidos:', data);
        const balance = data.current_balance || 0;
        console.log('Balance establecido:', balance);
        setCurrentBalance(balance);
      } else {
        console.error('Error en la respuesta del servidor:', response.status);
      }
    } catch (err) {
      console.error('Error cargando balance:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const numValue = parseFloat(value);
      if (value && !isNaN(numValue)) {
        if (numValue > 1000000000) {
          setError('El monto no puede exceder 1 billón');
          return;
        }
        if (numValue <= 0) {
          setError('El monto debe ser mayor a 0');
          return;
        }
      }
      setError('');
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) {
      setError('Completa todos los campos');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }
    if (amount > 1000000000) {
      setError('El monto no puede exceder 1 billón');
      return;
    }
    if (formData.description.trim().length < 3) {
      setError('La descripción debe tener al menos 3 caracteres');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let dateString;
      if (formData.date) {
        dateString = formData.date;
      } else {
        const now = new Date();
        const colombiaDate = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
        dateString = colombiaDate.toISOString().split('T')[0];
      }
      
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        date: dateString
      };

      let result;
      if (editingId) {
        result = await transactionService.updateTransaction(editingId, transactionData);
      } else {
        result = await transactionService.createTransaction(transactionData);
      }

      if (result.success) {
        await loadTransactions();
        await loadCurrentBalance();
        triggerAchievementsRefresh();
        setFormData({ type: 'expense', amount: '', category: '', description: '', date: '' });
        setEditingId(null);
        setError('');
        setSuccess(editingId ? 'Transacción actualizada correctamente' : 'Transacción guardada correctamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        if (typeof result.error === 'object') {
          const errorMessages = Object.values(result.error).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(result.error || 'Error al procesar la transacción');
        }
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError('Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta transacción?')) {
      try {
        const result = await transactionService.deleteTransaction(id);
        if (result.success) {
          await loadTransactions(); 
          await loadCurrentBalance(); 
          triggerAchievementsRefresh();
          setError(''); 
          setSuccess('Transacción eliminada correctamente');
          setTimeout(() => setSuccess(''), 3000); 
        } else {
          setError(result.error || 'Error al eliminar la transacción');
        }
      } catch (err) {
        console.error('Error eliminando transacción:', err);
        setError('Error de conexión al eliminar la transacción. Verifica tu conexión a internet.');
      }
    }
  };

  const handleEdit = (tx) => {
    setError('');
    setSuccess('');
    setFormData({
      type: tx.type || 'expense',
      amount: tx.amount ? tx.amount.toString() : '',
      category: tx.category_name || tx.category || '',
      description: typeof tx.description === 'string' ? tx.description : (tx.description?.description || ''),
      date: tx.date || ''
    });
    setEditingId(tx.id);
  };

  const handleCancelEdit = () => {
    setFormData({ type: 'expense', amount: '', category: '', description: '', date: '' });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const getTypeLabel = (type) => type === 'income' ? 'Ingreso' : type === 'savings' ? 'Ahorro' : 'Gasto';
  const getTypeIcon = (type) => type === 'income' ? '💰' : type === 'savings' ? '🏦' : '💸';
  const getTotalByType = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const totalIncome = getTotalByType('income');
  const totalExpenses = getTotalByType('expense');
  const totalSavings = getTotalByType('savings');
  const availableMoney = currentBalance;

  return (
    <div className="expenses-page">
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h1>Registra tus movimientos con Oink</h1>
            <p>Gastos, ingresos y ahorros — todo en un solo lugar.</p>
          </div>

          <div className="form-content">
            <div className="form-left">
              {error && (
                <div className="error-message" style={{ 
                  background: '#fee', 
                  color: '#c33', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  marginBottom: '20px',
                  border: '1px solid #fcc'
                }}>
                  {error}
                </div>
              )}
              {success && (
                <div className="success-message" style={{ 
                  background: '#efe', 
                  color: '#363', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  marginBottom: '20px',
                  border: '1px solid #cfc'
                }}>
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                  <label className="form-label">Tipo de movimiento</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                    >
                      💸 Gasto
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                    >
                      💰 Ingreso
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${formData.type === 'savings' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'savings' }))}
                    >
                      🏦 Ahorro
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Monto</label>
                  <div className="input-container">
                    <FaDollarSign className="input-icon" />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Ej: $20.000"
                      className="form-input"
                      min="0.01"
                      max="1000000000"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <div className="input-container">
                    <FaTag className="input-icon" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {defaultCategories[formData.type].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <div className="input-container">
                    <FaReceipt className="input-icon" />
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Descripción del movimiento"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <div className="input-container">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="fa-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        {editingId ? 'Actualizar' : 'Agregar'} {getTypeLabel(formData.type)}
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      disabled={submitting}
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="form-right">
              <img src={pigHead} alt="Cerdito Oink" className="pig-image" />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de totales */}
      <div className="totals-section">
        <div className="totals-container">
          <h2>Resumen de tu dinero</h2>
          <div className="totals-grid">
            <div className="total-card income">
              <div className="total-icon">
                <FaArrowUp />
              </div>
              <div className="total-content">
                <h3>Ingresos</h3>
                <p className="total-amount">${totalIncome.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="total-card expense">
              <div className="total-icon">
                <FaArrowDown />
              </div>
              <div className="total-content">
                <h3>Gastos</h3>
                <p className="total-amount">${totalExpenses.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="total-card savings">
              <div className="total-icon">
                <FaPiggyBank />
              </div>
              <div className="total-content">
                <h3>Ahorros</h3>
                <p className="total-amount">${totalSavings.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="total-card available">
              <div className="total-icon">
                <FaDollarSign />
              </div>
              <div className="total-content">
                <h3>Dinero Disponible</h3>
                <p className={`total-amount ${availableMoney >= 0 ? 'positive' : 'negative'}`}>
                  ${availableMoney.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-section">
        <div className="table-container">
          <h2>Historial de transacciones</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <FaSpinner className="fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }} />
              <p>Cargando transacciones...</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-message">
                      No hay registros aún. ¡Agrega tu primera transacción!
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{getTypeIcon(tx.type)} {getTypeLabel(tx.type)}</td>
                      <td>{tx.category_name || tx.category || 'Sin categoría'}</td>
                      <td>{typeof tx.description === 'string' ? tx.description : (tx.description?.description || 'Sin descripción')}</td>
                      <td>${parseFloat(tx.amount).toLocaleString()}</td>
                      <td>{new Date(tx.date).toLocaleDateString('es-ES')}</td>
                      <td>
                        <button className="action-btn edit-btn" onClick={() => handleEdit(tx)}>
                          <FaEdit />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(tx.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;

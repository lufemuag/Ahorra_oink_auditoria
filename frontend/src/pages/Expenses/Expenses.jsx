import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaDollarSign,
  FaTag,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPiggyBank,
  FaReceipt
} from 'react-icons/fa';
import './Expenses.css';

const Expenses = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense', // 'expense', 'income', 'savings'
    amount: '',
    category: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = {
    expense: [
      'Alimentación',
      'Transporte',
      'Entretenimiento',
      'Salud',
      'Educación',
      'Vivienda',
      'Ropa',
      'Tecnología',
      'Otros'
    ],
    income: [
      'Salario',
      'Freelance',
      'Inversiones',
      'Ventas',
      'Bonificaciones',
      'Otros ingresos'
    ],
    savings: [
      'Fondo de emergencia',
      'Vacaciones',
      'Educación',
      'Casa',
      'Coche',
      'Retiro',
      'Otros ahorros'
    ]
  };

  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user]);

  useEffect(() => {
    // Agregar clase al body cuando se monta el componente
    document.body.classList.add('expenses-page-active');
    
    // Limpiar clase del body cuando se desmonta el componente
    return () => {
      document.body.classList.remove('expenses-page-active');
    };
  }, []);

  const loadTransactions = () => {
    try {
      // Datos de prueba
      const mockTransactions = [
        {
          id: 1,
          type: 'expense',
          amount: 500000,
          category: 'Transporte',
          description: 'Gasolina',
          date: new Date().toISOString()
        },
        {
          id: 2,
          type: 'savings',
          amount: 500000,
          category: 'Fondo de emergencia',
          description: 'Ahorro mensual',
          date: new Date().toISOString()
        },
        {
          id: 3,
          type: 'expense',
          amount: 500000,
          category: 'Transporte',
          description: 'Uber',
          date: new Date().toISOString()
        },
        {
          id: 4,
          type: 'income',
          amount: 2000000,
          category: 'Salario',
          description: 'Pago mensual',
          date: new Date().toISOString()
        }
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type,
      category: '' // Reset category when type changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (editingId) {
      // Editar transacción existente
      setTransactions(prev => prev.map(t => 
        t.id === editingId 
          ? {
              ...t,
              type: formData.type,
              amount: parseFloat(formData.amount),
              category: formData.category,
              description: formData.description,
              date: new Date().toISOString()
            }
          : t
      ));
      setEditingId(null);
    } else {
      // Agregar nueva transacción
      const newTransaction = {
        id: Date.now(),
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);
    }
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description
    });
    setEditingId(transaction.id);
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income':
        return '💰';
      case 'savings':
        return '🏦';
      case 'expense':
      default:
        return '💸';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'income':
        return '#4caf50';
      case 'savings':
        return '#2196f3';
      case 'expense':
      default:
        return '#f44336';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'income':
        return 'Ingreso';
      case 'savings':
        return 'Ahorro';
      case 'expense':
      default:
        return 'Gasto';
    }
  };

  const getTotalByType = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="expenses-page">
      {/* Sección 1: Formulario */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h1>Gestiona tus finanzas con Oink</h1>
            <p>
              Registra aquí tus gastos, ingresos y ahorros diarios, semanales o mensuales.
              De esta manera, Oink te ayudará a tener un mayor control de tus finanzas.
            </p>
          </div>

          <div className="form-content">
            <div className="form-left">
              <form onSubmit={handleSubmit} className="transaction-form">
                {/* Tipo de transacción */}
                <div className="form-group">
                  <label className="form-label">Tipo de transacción</label>
                  <div className="type-buttons">
                    <button
                      type="button"
                      className={`type-btn ${formData.type === 'expense' ? 'active' : ''}`}
                      onClick={() => handleTypeChange('expense')}
                    >
                      <span>💸</span>
                      Gastos
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${formData.type === 'income' ? 'active' : ''}`}
                      onClick={() => handleTypeChange('income')}
                    >
                      <span>💰</span>
                      Ingresos
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${formData.type === 'savings' ? 'active' : ''}`}
                      onClick={() => handleTypeChange('savings')}
                    >
                      <span>🏦</span>
                      Ahorros
                    </button>
                  </div>
                </div>

                {/* Monto */}
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
                      required
                    />
                  </div>
                </div>

                {/* Categoría */}
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
                      {categories[formData.type].map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descripción */}
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

                {/* Botones de envío */}
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    <FaPlus />
                    {editingId ? 'Actualizar' : 'Agregar'} {getTypeLabel(formData.type)}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="form-right">
              <div className="pig-illustration">
                <div className="pig-head">
                  <div className="pig-glasses"></div>
                  <div className="pig-eyes">
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                  </div>
                  <div className="pig-nose"></div>
                  <div className="pig-smile"></div>
                  <div className="pig-hat"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Tabla de registros */}
      <div className="table-section">
        <div className="table-container">
          <div className="table-header">
            <h2>Registros de Transacciones</h2>
            <div className="totals-summary">
              <div className="total-item income">
                <span className="total-icon">💰</span>
                <div className="total-info">
                  <span className="total-label">Ingresos</span>
                  <span className="total-amount">${getTotalByType('income').toLocaleString()}</span>
                </div>
              </div>
              <div className="total-item expense">
                <span className="total-icon">💸</span>
                <div className="total-info">
                  <span className="total-label">Gastos</span>
                  <span className="total-amount">${getTotalByType('expense').toLocaleString()}</span>
                </div>
              </div>
              <div className="total-item savings">
                <span className="total-icon">🏦</span>
                <div className="total-info">
                  <span className="total-label">Ahorros</span>
                  <span className="total-amount">${getTotalByType('savings').toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="table-wrapper">
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
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="type-cell">
                          <span className="type-icon">{getTypeIcon(transaction.type)}</span>
                          <span className="type-label">{getTypeLabel(transaction.type)}</span>
                        </div>
                      </td>
                      <td>{transaction.category}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span 
                          className="amount-cell"
                          style={{ color: getTypeColor(transaction.type) }}
                        >
                          {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {new Date(transaction.date).toLocaleDateString('es-ES')}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(transaction)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(transaction.id)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
import React, { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaSearch, FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';
import AddIncomeModal from '../../components/dashboard/AddIncomeModal';
import AddExpenseModal from '../../components/dashboard/AddExpenseModal';
import './Transactions.css';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modals, setModals] = useState({
    income: false,
    expense: false
  });

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  const loadTransactions = () => {
    setLoading(true);
    try {
      const userTransactions = transactionService.getByUser(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTransactions = () => {
    let filtered = [...transactions];

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
  };

  const handleTransactionSuccess = () => {
    loadTransactions();
  };

  const openModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      const result = transactionService.delete(transactionId);
      if (result.success) {
        loadTransactions();
      } else {
        alert('Error al eliminar la transacción');
      }
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? <FaArrowUp className="transaction-icon income" /> : <FaArrowDown className="transaction-icon expense" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalByType = (type) => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = getTotalByType('income');
  const totalExpenses = getTotalByType('expense');
  const balance = totalIncome - totalExpenses;

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="transactions-header">
        <div className="header-content">
          <h1>Transacciones</h1>
          <p>Gestiona todos tus ingresos y gastos</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-success"
            onClick={() => openModal('income')}
          >
            <FaPlus />
            Agregar Ingreso
          </button>
          <button
            className="btn btn-danger"
            onClick={() => openModal('expense')}
          >
            <FaPlus />
            Agregar Gasto
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="transactions-summary">
        <div className="summary-card income">
          <h3>Total Ingresos</h3>
          <p className="summary-amount">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Gastos</h3>
          <p className="summary-amount">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="summary-card balance">
          <h3>Balance</h3>
          <p className={`summary-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="transactions-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="filter-select"
          >
            <option value="date-desc">Más recientes</option>
            <option value="date-asc">Más antiguas</option>
            <option value="amount-desc">Mayor monto</option>
            <option value="amount-asc">Menor monto</option>
            <option value="description-asc">A-Z</option>
            <option value="description-desc">Z-A</option>
          </select>
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="transactions-list-container">
        {loading ? (
          <div className="loading-state">
            <p>Cargando transacciones...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <h3>No hay transacciones</h3>
            <p>
              {searchTerm || filterType !== 'all' 
                ? 'No se encontraron transacciones con los filtros aplicados.'
                : 'Comienza agregando tus primeros ingresos y gastos.'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <div className="empty-actions">
                <button
                  className="btn btn-success"
                  onClick={() => openModal('income')}
                >
                  <FaPlus />
                  Agregar Ingreso
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => openModal('expense')}
                >
                  <FaPlus />
                  Agregar Gasto
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon-container">
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div className="transaction-details">
                  <div className="transaction-main">
                    <h4 className="transaction-description">
                      {transaction.description}
                    </h4>
                    <span className="transaction-category">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="transaction-meta">
                    <span className="transaction-date">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
                
                <div className="transaction-amount-section">
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                  <div className="transaction-actions">
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="btn-icon danger"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <AddIncomeModal
        isOpen={modals.income}
        onClose={() => closeModal('income')}
        onSuccess={handleTransactionSuccess}
      />
      
      <AddExpenseModal
        isOpen={modals.expense}
        onClose={() => closeModal('expense')}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default Transactions;


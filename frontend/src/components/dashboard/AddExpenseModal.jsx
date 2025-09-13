import React, { useState } from 'react';
import { FaMinus, FaCalendarAlt, FaTag, FaEdit } from 'react-icons/fa';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import './AddExpenseModal.css';

const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = transactionService.getCategories('expense');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Por favor ingresa un monto válido');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Por favor selecciona una categoría');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Por favor ingresa una descripción');
      setLoading(false);
      return;
    }

    try {
      const result = transactionService.create({
        userId: user.id,
        type: 'expense',
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString()
      });

      if (result.success) {
        // Resetear formulario
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        
        onSuccess && onSuccess(result.transaction);
        onClose();
      } else {
        setError(result.error || 'Error al crear el gasto');
      }
    } catch (error) {
      setError('Error inesperado al crear el gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span>
          <FaMinus className="modal-title-icon" />
          Agregar Gasto
        </span>
      }
      size="medium"
    >
          <form onSubmit={handleSubmit} className="expense-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                <FaMinus className="label-icon" />
                Monto *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <FaTag className="label-icon" />
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <FaEdit className="label-icon" />
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe el gasto..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                <FaCalendarAlt className="label-icon" />
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Agregar Gasto'}
              </button>
            </div>
          </form>
    </Modal>
  );
};

export default AddExpenseModal;

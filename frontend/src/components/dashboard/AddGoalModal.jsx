import React, { useState } from 'react';
import { FaBullseye, FaCalendarAlt, FaTag, FaEdit } from 'react-icons/fa';
import { goalService } from '../../services/goalService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import './AddGoalModal.css';

const AddGoalModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: '',
    targetDate: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Ahorro', 'Viaje', 'Educación', 'Casa', 'Automóvil', 'Emergencia', 'Otro'];
  const priorities = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' }
  ];

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
    if (!formData.title.trim()) {
      setError('Por favor ingresa un título para la meta');
      setLoading(false);
      return;
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      setError('Por favor ingresa un monto objetivo válido');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Por favor selecciona una categoría');
      setLoading(false);
      return;
    }

    if (!formData.targetDate) {
      setError('Por favor selecciona una fecha objetivo');
      setLoading(false);
      return;
    }

    // Validar que la fecha objetivo sea futura
    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (targetDate <= today) {
      setError('La fecha objetivo debe ser futura');
      setLoading(false);
      return;
    }

    try {
      const result = goalService.create({
        userId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        category: formData.category,
        targetDate: new Date(formData.targetDate).toISOString(),
        priority: formData.priority,
        currentAmount: 0
      });

      if (result.success) {
        // Resetear formulario
        setFormData({
          title: '',
          description: '',
          targetAmount: '',
          category: '',
          targetDate: '',
          priority: 'medium'
        });
        
        onSuccess && onSuccess(result.goal);
        onClose();
      } else {
        setError(result.error || 'Error al crear la meta');
      }
    } catch (error) {
      setError('Error inesperado al crear la meta');
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
          <FaBullseye className="modal-title-icon" />
          Nueva Meta de Ahorro
        </span>
      }
      size="medium"
    >
      <form onSubmit={handleSubmit} className="goal-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            <FaEdit className="label-icon" />
            Título de la Meta *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Ej: Vacaciones en Europa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            <FaEdit className="label-icon" />
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Describe tu meta..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetAmount" className="form-label">
            <FaBullseye className="label-icon" />
            Monto Objetivo *
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
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
          <label htmlFor="priority" className="form-label">
            <FaTag className="label-icon" />
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="form-select"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="targetDate" className="form-label">
            <FaCalendarAlt className="label-icon" />
            Fecha Objetivo *
          </label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleInputChange}
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
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
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Meta'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGoalModal;





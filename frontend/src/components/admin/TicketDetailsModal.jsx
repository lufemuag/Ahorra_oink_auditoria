import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaUser, FaCalendarAlt, FaTag, FaExclamationTriangle, FaClock, FaCheckCircle, FaTimesCircle, FaReply, FaPaperPlane } from 'react-icons/fa';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import './TicketDetailsModal.css';

const TicketDetailsModal = ({ isOpen, onClose, ticketId }) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newResponse, setNewResponse] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

  useEffect(() => {
    if (isOpen && ticketId) {
      loadTicketDetails();
    }
  }, [isOpen, ticketId]);

  const loadTicketDetails = () => {
    setLoading(true);
    setError('');

    try {
      const result = ticketService.getTicketById(ticketId);
      if (result.success) {
        setTicket(result.ticket);
      } else {
        setError(result.error || 'Error al cargar el ticket');
      }
    } catch (error) {
      setError('Error inesperado al cargar el ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = ticketService.updateTicketStatus(ticketId, newStatus);
      if (result.success) {
        setTicket(prev => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }));
      } else {
        setError(result.error || 'Error al actualizar el estado');
      }
    } catch (error) {
      setError('Error inesperado al actualizar el estado');
    }
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setSendingResponse(true);
    try {
      const result = ticketService.addTicketResponse(ticketId, newResponse.trim());
      if (result.success) {
        setTicket(result.ticket);
        setNewResponse('');
      } else {
        setError(result.error || 'Error al enviar la respuesta');
      }
    } catch (error) {
      setError('Error inesperado al enviar la respuesta');
    } finally {
      setSendingResponse(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaExclamationTriangle className="status-icon open" />;
      case 'in_progress': return <FaClock className="status-icon in-progress" />;
      case 'closed': return <FaCheckCircle className="status-icon closed" />;
      default: return <FaTimesCircle className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'danger';
      case 'in_progress': return 'warning';
      case 'closed': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span>
          <FaTicketAlt className="modal-title-icon" />
          Detalles del Ticket
          {ticket && (
            <span className="ticket-id">#{ticket.id.slice(-6)}</span>
          )}
        </span>
      }
      size="full"
    >
      <div className="ticket-details-content">
        {loading ? (
          <div className="loading-state">
            <p>Cargando detalles del ticket...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadTicketDetails} className="btn btn-outline">
              Reintentar
            </button>
          </div>
        ) : ticket ? (
          <>
            {/* Header del ticket */}
            <div className="ticket-header">
              <div className="ticket-title-section">
                <h2 className="ticket-title">{ticket.title}</h2>
                <div className="ticket-meta">
                  <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'high' ? 'Alta' : 
                     ticket.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status === 'open' ? 'Abierto' :
                     ticket.status === 'in_progress' ? 'En Progreso' : 'Cerrado'}
                  </span>
                </div>
              </div>
              
              <div className="ticket-actions">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className={`status-select ${getStatusColor(ticket.status)}`}
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>
            </div>

            {/* Información del ticket */}
            <div className="ticket-info-grid">
              <div className="info-item">
                <FaUser className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Usuario</span>
                  <span className="info-value">{ticket.userName} (@{ticket.username})</span>
                </div>
              </div>
              
              <div className="info-item">
                <FaTag className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Categoría</span>
                  <span className="info-value">{ticket.category}</span>
                </div>
              </div>
              
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Creado</span>
                  <span className="info-value">{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
              
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Actualizado</span>
                  <span className="info-value">{formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Descripción del ticket */}
            <div className="ticket-description">
              <h3>Descripción</h3>
              <p>{ticket.description}</p>
            </div>

            {/* Respuestas */}
            <div className="ticket-responses">
              <h3>Respuestas ({ticket.responses?.length || 0})</h3>
              
              {ticket.responses && ticket.responses.length > 0 ? (
                <div className="responses-list">
                  {ticket.responses.map((response) => (
                    <div key={response.id} className={`response-item ${response.isAdmin ? 'admin' : 'user'}`}>
                      <div className="response-header">
                        <div className="response-author">
                          <FaUser className="author-icon" />
                          <span className="author-name">{response.userName}</span>
                          {response.isAdmin && (
                            <span className="admin-badge">Admin</span>
                          )}
                        </div>
                        <span className="response-date">{formatDate(response.createdAt)}</span>
                      </div>
                      <div className="response-content">
                        <p>{response.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-responses">
                  <p>No hay respuestas aún.</p>
                </div>
              )}

              {/* Formulario de respuesta */}
              {ticket.status !== 'closed' && (
                <form onSubmit={handleSendResponse} className="response-form">
                  <div className="response-input-container">
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      className="response-textarea"
                      rows="3"
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-primary send-button"
                      disabled={sendingResponse || !newResponse.trim()}
                    >
                      <FaPaperPlane />
                      {sendingResponse ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default TicketDetailsModal;







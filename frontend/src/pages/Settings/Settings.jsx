import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { settingsService } from '../../services/settingsService';
import { authService } from '../../services/authService';
import { savingsMethodService } from '../../services/savingsMethodService';
import { FaSave, FaSpinner, FaUser, FaBell, FaEnvelope, FaLock, FaCheck, FaTimes, FaEye, FaEyeSlash, FaTrash, FaExclamationTriangle, FaPiggyBank } from 'react-icons/fa';
import cerdoConfig from '../../assets/cerdoConfig.png';
import './Settings.css';
import { triggerAchievementsRefresh } from '../../utils/achievements';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    email_notifications: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({
    password: '',
    reason: '',
    confirmText: ''
  });
  const [deleting, setDeleting] = useState(false);
  
  // Estados para el método de ahorro
  const [savingsMethod, setSavingsMethod] = useState(null);
  const [canChangeMethod, setCanChangeMethod] = useState(true);
  const [daysUntilChange, setDaysUntilChange] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState('');

  useEffect(() => {
    loadSettings();
    loadSavingsMethod();
  }, []);

  const loadSavingsMethod = async () => {
    try {
      const result = await savingsMethodService.getCurrentMethod();
      if (result.success && result.data) {
        setSavingsMethod(result.data.method);
        setCanChangeMethod(result.data.can_change !== undefined ? result.data.can_change : true);
        setDaysUntilChange(result.data.days_until_change || 0);
        setMonthlyIncome(result.data.monthly_income || '');
      }
    } catch (err) {
      console.error('Error cargando método de ahorro:', err);
    }
  };

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await settingsService.getSettings();
      if (result.success) {
        setSettings(result.settings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : e.target.value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await settingsService.updateSettings(settings);
      if (result.success) {
        setSuccess('Configuraciones guardadas exitosamente');
        triggerAchievementsRefresh();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al guardar configuraciones');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (field, value) => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Validaciones específicas por campo
      if (field === 'correo') {
        // Validar que el nombre de usuario no esté vacío
        if (!value.trim()) {
          setError('El nombre de usuario no puede estar vacío');
          setSaving(false);
          return;
        }
        
        // Validar que no contenga caracteres especiales
        if (!/^[a-zA-Z0-9._-]+$/.test(value.trim())) {
          setError('El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
          setSaving(false);
          return;
        }
        
        // Construir el correo completo
        const fullEmail = `${value.trim()}@pascualbravo.edu.co`;
        
        // Llamada real a la API para actualizar el correo
        const result = await authService.updateMe({ correo: fullEmail });
        
        if (result.success) {
          setSuccess(`Correo actualizado exitosamente a ${fullEmail}`);
          triggerAchievementsRefresh();
          window.location.reload(); 
        } else {
          setError(result.error || 'Error al actualizar el correo');
        }
      } else if (field === 'nombrecompleto') {
        if (!value.trim()) {
          setError('El usuario no puede estar vacío');
          setSaving(false);
          return;
        }
        
        // Llamada real a la API para actualizar el nombre
        const result = await authService.updateMe({ nombrecompleto: value.trim() });
        
        if (result.success) {
          setSuccess('Usuario actualizado exitosamente');
          triggerAchievementsRefresh();
          window.location.reload(); 
        } else {
          setError(result.error || 'Error al actualizar el usuario');
        }
      } else if (field === 'contraseniaencriptada') {
        // Mostrar el formulario de cambio de contraseña
        setShowPasswordForm(true);
        setSaving(false);
        return;
      }
      
      if (field !== 'contraseniaencriptada') {
        setTimeout(() => setSuccess(''), 3000);
        setEditingField(null);
        setEditValue('');
      }
    } catch (err) {
      setError(`Error al actualizar ${field === 'nombrecompleto' ? 'usuario' : field === 'correo' ? 'correo' : 'contraseña'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditStart = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleEditSave = () => {
    if (editingField && editValue.trim()) {
      handleUpdateProfile(editingField, editValue);
    }
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validaciones
    if (!passwordData.currentPassword.trim()) {
      setError('La contraseña actual es requerida');
      setSaving(false);
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setError('La nueva contraseña es requerida');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSaving(false);
      return;
    }

    try {
      const result = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (result.success) {
        setSuccess('Contraseña cambiada correctamente');
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setEditingField(null);
        triggerAchievementsRefresh();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Error al cambiar contraseña');
      }
    } catch (error) {
      setError('Error inesperado al cambiar contraseña');
    }

    setSaving(false);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavingsMethodChange = async (newMethod, newIncome) => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await savingsMethodService.updateMethod(newMethod, parseFloat(newIncome));
      
      if (result.success) {
        setSuccess('Método de ahorro actualizado correctamente');
        setEditingField(null);
        await loadSavingsMethod(); 
        triggerAchievementsRefresh();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Error al actualizar método de ahorro');
        if (result.days_remaining) {
          setError(`${result.error}. Faltan ${result.days_remaining} días.`);
        }
      }
    } catch (err) {
      setError('Error al actualizar método de ahorro');
    } finally {
      setSaving(false);
    }
  };
  
  const getMethodName = (methodId) => {
    const methodNames = {
      '50-30-20': 'Método 50:30:20',
      'sobres': 'Método de Sobres',
      'automatico': 'Ahorro Automático',
      '1dolar': 'Ahorro del $1',
      'redondeo': 'Método del Redondeo'
    };
    return methodNames[methodId] || 'No seleccionado';
  };

  const handleDeleteInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteAccount = async () => {
    if (!deleteData.password.trim()) {
      setError('Se requiere la contraseña para confirmar la eliminación');
      return;
    }

    if (deleteData.confirmText !== 'ELIMINAR') {
      setError('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const result = await authService.deleteAccount(deleteData.password, deleteData.reason);
      
      if (result.success) {
        setSuccess('Tu cuenta ha sido eliminada exitosamente');
      
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(result.error || 'Error al eliminar la cuenta');
      }
    } catch (err) {
      console.error('Error eliminando cuenta:', err);
      setError('Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="settings">
        <div className="stage">
          <div className="loading">
            <FaSpinner className="spinner" />
            <p>Cargando configuraciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="stage">
        <div className="hero">
          <div className="panel">
            <h1 className="title">Configuración</h1>
            <p className="subtitle">{user?.correo}</p>

            <div className="settings-options">
                      {/* Cambiar Usuario */}
                      <div className="setting-item">
                        <div className="dropdown-container">
                          <button 
                            className="setting-button"
                            onClick={() => handleEditStart('nombrecompleto', user?.nombrecompleto)}
                          >
                            <span>
                              <FaUser style={{ marginRight: '8px' }} />
                              usuario: {user?.nombrecompleto || 'usuario'}
                            </span>
                            <FaUser />
                          </button>
                    
                          {editingField === 'nombrecompleto' && (
                            <div className="edit-modal">
                              <div className="edit-content">
                                <h3>Editar Usuario</h3>
                                <input
                                  type="text"
                                  className="username-input"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  placeholder="Ingresa tu nombre de usuario"
                                />
                        <div className="edit-actions">
                          <button className="cancel-btn" onClick={handleEditCancel}>
                            <FaTimes />
                            Cancelar
                          </button>
                          <button className="save-btn" onClick={handleEditSave} disabled={saving}>
                            {saving ? <FaSpinner className="spinner" /> : <FaCheck />}
                            {saving ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cambiar Correo */}
              <div className="setting-item">
                <div className="dropdown-container">
                  <button 
                    className="setting-button email-button"
                    onClick={() => {
                     
                      const currentEmail = user?.correo || '';
                      const emailName = currentEmail.includes('@') ? currentEmail.split('@')[0] : '';
                      handleEditStart('correo', emailName);
                    }}
                  >
                    <span>
                      <FaEnvelope style={{ marginRight: '8px' }} />
                      Correo: {user?.correo || 'Sin correo'}
                    </span>
                    <FaEnvelope />
                  </button>
                  
                  {editingField === 'correo' && (
                    <div className="edit-modal">
                      <div className="edit-content">
                        <h3>Editar Nombre de Usuario</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            className="username-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Ingresa tu nombre de usuario"
                            style={{ flex: 1, marginBottom: 0 }}
                          />
                          <span style={{ 
                            color: '#666', 
                            fontWeight: '600', 
                            fontSize: '1rem',
                            whiteSpace: 'nowrap'
                          }}>
                            @pascualbravo.edu.co
                          </span>
                        </div>
                        <div className="edit-actions">
                          <button className="cancel-btn" onClick={handleEditCancel}>
                            <FaTimes />
                            Cancelar
                          </button>
                          <button className="save-btn" onClick={handleEditSave} disabled={saving}>
                            {saving ? <FaSpinner className="spinner" /> : <FaCheck />}
                            {saving ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cambiar Contraseña */}
              <div className="setting-item">
                <div className="dropdown-container">
                  <button 
                    className="setting-button password-button"
                    onClick={() => handleEditStart('contraseniaencriptada', '')}
                  >
                    <span>
                      <FaLock style={{ marginRight: '8px' }} />
                      Contraseña: ••••••••
                    </span>
                    <FaLock />
                  </button>
                  
                  {editingField === 'contraseniaencriptada' && (
                    <div className="edit-modal">
                      <div className="edit-content">
                        <h3>Cambiar Contraseña</h3>
                        
                        {!showPasswordForm ? (
                          <div>
                            <p>Para cambiar tu contraseña, necesitamos verificar tu identidad.</p>
                            <div className="edit-actions">
                              <button className="cancel-btn" onClick={handleEditCancel}>
                                <FaTimes />
                                Cancelar
                              </button>
                              <button className="save-btn" onClick={() => setShowPasswordForm(true)}>
                                <FaLock />
                                Continuar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                              <label className="form-label">Contraseña Actual</label>
                              <div className="password-input-wrapper">
                                <input
                                  type={showCurrentPassword ? 'text' : 'password'}
                                  name="currentPassword"
                                  value={passwordData.currentPassword}
                                  onChange={handlePasswordInputChange}
                                  className="username-input"
                                  placeholder="Ingresa tu contraseña actual"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="password-toggle"
                                >
                                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Nueva Contraseña</label>
                              <div className="password-input-wrapper">
                                <input
                                  type={showNewPassword ? 'text' : 'password'}
                                  name="newPassword"
                                  value={passwordData.newPassword}
                                  onChange={handlePasswordInputChange}
                                  className="username-input"
                                  placeholder="Ingresa tu nueva contraseña"
                                  required
                                  minLength="8"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="password-toggle"
                                >
                                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Confirmar Nueva Contraseña</label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordInputChange}
                                className="username-input"
                                placeholder="Confirma tu nueva contraseña"
                                required
                                minLength="8"
                              />
                            </div>

                            <div className="edit-actions">
                              <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                  setEditingField(null);
                                }}
                              >
                                <FaTimes />
                                Cancelar
                              </button>
                              <button 
                                type="submit" 
                                className="save-btn" 
                                disabled={saving}
                              >
                                {saving ? <FaSpinner className="spinner" /> : <FaCheck />}
                                {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Método de Ahorro */}
              <div className="setting-item">
                <div className="dropdown-container">
                  <button 
                    className="setting-button"
                    onClick={() => handleEditStart('savingsMethod', '')}
                  >
                    <span>
                      <FaPiggyBank style={{ marginRight: '8px' }} />
                      Método de ahorro: {getMethodName(savingsMethod)}
                    </span>
                    <FaPiggyBank />
                  </button>
                  
                  {editingField === 'savingsMethod' && (
                    <div className="edit-modal">
                      <div className="edit-content">
                        <h3>Cambiar Método de Ahorro</h3>
                        
                        {!canChangeMethod ? (
                          <div style={{ padding: '20px', textAlign: 'center' }}>
                            <FaLock style={{ fontSize: '48px', color: '#ffc107', marginBottom: '15px' }} />
                            <p style={{ color: '#856404', marginBottom: '10px' }}>
                              Debes esperar <strong>{daysUntilChange} días</strong> para cambiar tu método de ahorro.
                            </p>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                              Método actual: <strong>{getMethodName(savingsMethod)}</strong>
                            </p>
                            <div className="edit-actions" style={{ marginTop: '20px' }}>
                              <button className="cancel-btn" onClick={handleEditCancel}>
                                <FaTimes />
                                Cerrar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const selectedMethod = e.target.method.value;
                            const income = e.target.monthly_income.value;
                            if (selectedMethod && income) {
                              handleSavingsMethodChange(selectedMethod, income);
                            } else {
                              setError('Completa todos los campos');
                            }
                          }}>
                            <div className="form-group">
                              <label className="form-label">Método de Ahorro</label>
                              <select 
                                name="method"
                                className="username-input"
                                defaultValue={savingsMethod || ''}
                                required
                              >
                                <option value="">Selecciona un método</option>
                                <option value="50-30-20">Método 50:30:20</option>
                                <option value="sobres">Método de Sobres</option>
                                <option value="automatico">Ahorro Automático</option>
                                <option value="1dolar">Ahorro del $1</option>
                                <option value="redondeo">Método del Redondeo</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Ingreso Mensual</label>
                              <input
                                type="number"
                                name="monthly_income"
                                className="username-input"
                                placeholder="Ej: 1000000"
                                defaultValue={monthlyIncome || ''}
                                required
                                min="0"
                                step="0.01"
                              />
                            </div>

                            <div className="edit-actions">
                              <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={handleEditCancel}
                              >
                                <FaTimes />
                                Cancelar
                              </button>
                              <button 
                                type="submit" 
                                className="save-btn" 
                                disabled={saving}
                              >
                                {saving ? <FaSpinner className="spinner" /> : <FaCheck />}
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notificaciones */}
              <div className="setting-item">
                <button 
                  className={`setting-button ${settings.notifications_enabled ? 'email-button' : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'notifications_enabled', type: 'checkbox', checked: !settings.notifications_enabled } })}
                >
                  <span>
                    <FaBell style={{ marginRight: '8px' }} />
                    Notificaciones: {settings.notifications_enabled ? 'Activadas' : 'Desactivadas'}
                  </span>
                  <FaBell />
                </button>
              </div>

              {/* Botón de guardar configuración */}
              <div className="setting-item">
                <button 
                  className="setting-button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <span>
                    {saving ? <FaSpinner className="spinner" /> : <FaSave />}
                    {saving ? 'Guardando...' : 'Guardar Configuración'}
                  </span>
                </button>
              </div>

              {/* Botón de eliminar cuenta */}
              <div className="setting-item">
                <button 
                  className="setting-button delete-button"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <span>
                    <FaTrash style={{ marginRight: '8px' }} />
                    Eliminar Cuenta
                  </span>
                  <FaExclamationTriangle />
                </button>
              </div>
            </div>
          </div>

          {/* Cerdito */}
          <div className="pig-wrap">
            <img src={cerdoConfig} alt="Cerdo Configuración" className="pig" />
          </div>
        </div>
      </div>


      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>
                <FaExclamationTriangle className="danger-icon" />
                Eliminar Cuenta
              </h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteData({ password: '', reason: '', confirmText: '' });
                  setError('');
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-content">
              <div className="warning-message">
                <FaExclamationTriangle className="warning-icon" />
                <p>
                  <strong>¡ADVERTENCIA!</strong> Esta acción es irreversible. 
                  Una vez eliminada tu cuenta, no podrás recuperar tus datos.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
                <div className="form-group">
                  <label className="form-label">Contraseña Actual</label>
                  <input
                    type="password"
                    name="password"
                    value={deleteData.password}
                    onChange={handleDeleteInputChange}
                    className="form-input"
                    placeholder="Ingresa tu contraseña para confirmar"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Razón (Opcional)</label>
                  <textarea
                    name="reason"
                    value={deleteData.reason}
                    onChange={handleDeleteInputChange}
                    className="form-textarea"
                    placeholder="¿Por qué quieres eliminar tu cuenta?"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Escribe <strong>"ELIMINAR"</strong> para confirmar
                  </label>
                  <input
                    type="text"
                    name="confirmText"
                    value={deleteData.confirmText}
                    onChange={handleDeleteInputChange}
                    className="form-input"
                    placeholder="ELIMINAR"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteData({ password: '', reason: '', confirmText: '' });
                      setError('');
                    }}
                  >
                    <FaTimes />
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="danger-btn"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <FaSpinner className="spinner" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        Eliminar Cuenta
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes */}
      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {success && (
        <div className="message success">
          {success}
        </div>
      )}
    </div>
  );
};

export default Settings;
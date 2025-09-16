import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaChevronDown,
  FaTrash,
  FaEdit,
  FaSave,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import pigImage from '../../assets/cerdoConfig.png';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    username: user?.username || 'usuario123',
    savingMethod: 'Transporte'
  });
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(settings.username);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const savingMethods = [
    'Transporte',
    'Gastos fijos',
    'Ahorro'
  ];

  useEffect(() => {
    // Agregar clase al body cuando se monta el componente
    document.body.classList.add('settings-page-active');
    
    // Limpiar clase del body cuando se desmonta el componente
    return () => {
      document.body.classList.remove('settings-page-active');
    };
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUsernameSave = () => {
    if (newUsername.trim()) {
      setSettings(prev => ({ ...prev, username: newUsername.trim() }));
      setEditingUsername(false);
      setMessage({ type: 'success', text: 'Nombre de usuario actualizado' });
    }
  };

  const handleUsernameCancel = () => {
    setNewUsername(settings.username);
    setEditingUsername(false);
  };

  const handleSavingMethodChange = (method) => {
    setSettings(prev => ({ ...prev, savingMethod: method }));
    setShowDropdown(false);
    setMessage({ type: 'success', text: `Método de ahorro cambiado a: ${method}` });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      setMessage({ type: 'info', text: 'Funcionalidad de eliminación en desarrollo' });
    }
  };

  return (
    <div className="settings-page">
      {/* Header Section */}
      <div className="settings-header">
        <div className="header-content">
          <h1>Vamos a arreglar unas cosas</h1>
        </div>
      </div>

      {/* Settings Card */}
      <div className="settings-card">
        <div className="settings-content">
          {/* Settings Options */}
          <div className="settings-options">
            {/* Change Username */}
            <div className="setting-item">
              <button 
                className="setting-button username-button"
                onClick={() => setEditingUsername(true)}
              >
                <span>Cambiar nombre de usuario</span>
                <FaEdit className="button-icon" />
              </button>
              
              {editingUsername && (
                <div className="edit-modal">
                  <div className="edit-content">
                    <h3>Cambiar nombre de usuario</h3>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="username-input"
                      placeholder="Nuevo nombre de usuario"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button className="save-btn" onClick={handleUsernameSave}>
                        <FaCheck />
                        Guardar
                      </button>
                      <button className="cancel-btn" onClick={handleUsernameCancel}>
                        <FaTimes />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Saving Method */}
            <div className="setting-item">
              <div className="dropdown-container">
                <button 
                  className="setting-button dropdown-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span>Cambiar metodo de ahorro</span>
                  <FaChevronDown className={`chevron-icon ${showDropdown ? 'rotated' : ''}`} />
                </button>
                
                {showDropdown && (
                  <div className="dropdown-menu">
                    {savingMethods.map((method) => (
                      <button
                        key={method}
                        className={`dropdown-item ${settings.savingMethod === method ? 'selected' : ''}`}
                        onClick={() => handleSavingMethodChange(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Delete Button */}
            <div className="setting-item">
              <button 
                className="setting-button delete-button"
                onClick={handleDeleteAccount}
              >
                <FaTrash className="button-icon" />
                <span>Eliminar cuenta</span>
              </button>
            </div>
          </div>

          {/* Pig Image */}
          <div className="pig-image-container">
            <img 
              src={pigImage} 
              alt="Cerdo Oink" 
              className="pig-image"
            />
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Settings;
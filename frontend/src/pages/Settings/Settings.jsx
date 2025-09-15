import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaDownload,
  FaTrash,
  FaSave,
  FaEdit,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || ''
    },
    preferences: {
      currency: 'USD',
      language: 'es',
      theme: 'light'
    }
  });

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'Dólar Americano' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
    { code: 'COP', symbol: '$', name: 'Peso Colombiano' },
    { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
    { code: 'CLP', symbol: '$', name: 'Peso Chileno' }
  ];

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' }
  ];

  const themes = [
    { code: 'light', name: 'Claro' },
    { code: 'dark', name: 'Oscuro' },
    { code: 'auto', name: 'Automático' }
  ];

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: FaUser },
    { id: 'preferences', label: 'Preferencias', icon: FaPalette },
    { id: 'security', label: 'Seguridad', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notificaciones', icon: FaBell },
    { id: 'data', label: 'Datos', icon: FaDownload }
  ];

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFieldEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleFieldSave = () => {
    if (editingField) {
      const [section, field] = editingField.split('.');
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: editValue
        }
      }));
      setEditingField(null);
      setEditValue('');
      setMessage({ type: 'success', text: 'Campo actualizado correctamente' });
    }
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveSettings = () => {
    setMessage({ type: 'success', text: 'Configuraciones guardadas correctamente' });
  };

  const renderField = (section, field, label, type = 'text', options = null) => {
    const value = settings[section][field];
    const fieldKey = `${section}.${field}`;
    const isEditing = editingField === fieldKey;

    return (
      <div className="setting-item">
        <label className="setting-label">{label}</label>
        <div className="setting-value">
          {isEditing ? (
            <div className="edit-mode">
              {type === 'select' ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="edit-input"
                >
                  {options.map(option => (
                    <option key={option.code || option} value={option.code || option}>
                      {option.name || option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="edit-input"
                />
              )}
              <div className="edit-actions">
                <button className="save-btn" onClick={handleFieldSave}>
                  <FaCheck />
                </button>
                <button className="cancel-btn" onClick={handleFieldCancel}>
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <div className="display-mode">
              <span className="value-text">
                {type === 'select' && options 
                  ? options.find(opt => opt.code === value)?.name || value
                  : value || 'No especificado'
                }
              </span>
              <button 
                className="edit-btn"
                onClick={() => handleFieldEdit(fieldKey, value)}
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Configuración</h1>
        <p>Personaliza tu experiencia y gestiona tu cuenta</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Información Personal</h2>
              <div className="settings-form">
                {renderField('profile', 'firstName', 'Nombre')}
                {renderField('profile', 'lastName', 'Apellido')}
                {renderField('profile', 'username', 'Nombre de usuario')}
                {renderField('profile', 'email', 'Correo electrónico', 'email')}
                {renderField('profile', 'phone', 'Teléfono', 'tel')}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>Preferencias</h2>
              <div className="settings-form">
                {renderField('preferences', 'currency', 'Moneda', 'select', currencies)}
                {renderField('preferences', 'language', 'Idioma', 'select', languages)}
                {renderField('preferences', 'theme', 'Tema', 'select', themes)}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Seguridad</h2>
              <div className="settings-form">
                <div className="setting-item">
                  <label className="setting-label">Cambiar Contraseña</label>
                  <div className="setting-value">
                    <button className="change-password-btn">
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notificaciones</h2>
              <div className="settings-form">
                <p>Configuración de notificaciones próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Gestión de Datos</h2>
              <div className="data-actions">
                <div className="data-action">
                  <h3>Exportar Datos</h3>
                  <p>Descarga una copia de todos tus datos personales</p>
                  <button className="export-btn">
                    <FaDownload />
                    Exportar Datos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-all-btn" onClick={handleSaveSettings}>
          <FaSave />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Settings;
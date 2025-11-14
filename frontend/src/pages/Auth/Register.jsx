// src/pages/Auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import pigImage from '../../assets/CerdoSign.png';


const EMAIL_DOMAIN = '@pascualbravo.edu.co';
const isDev = import.meta?.env?.MODE !== 'production';

function extractFirstError(errorsObj) {
  if (!errorsObj) return '';
  if (typeof errorsObj === 'string') return errorsObj;
  if (Array.isArray(errorsObj)) return errorsObj.map(String).join(' ');
  for (const [k, v] of Object.entries(errorsObj)) {
    if (Array.isArray(v)) return v.map(String).join(' ');
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') {
      const nested = extractFirstError(v);
      if (nested) return nested;
    }
  }
  return '';
}

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [lastResponse, setLastResponse] = useState(null);

  const { register, error: ctxError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const safeMode = new URLSearchParams(location.search).get('safe') === '1';

  useEffect(() => {
    if (ctxError) {
      setMessage({ type: 'error', text: ctxError });
      const t = setTimeout(() => { 
        clearError(); 
        setMessage({ type: '', text: '' }); 
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [ctxError]); 

  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      const cleanValue = value.replace(new RegExp(`${EMAIL_DOMAIN}$`, 'i'), '');
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const firstName = formData.firstName.trim();
    if (!firstName) newErrors.firstName = 'El nombre es requerido';
    else if (firstName.length < 2) newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';

    const usernameLocal = formData.username.trim();
    if (!usernameLocal) newErrors.username = 'El usuario es requerido';
    else {
      const usernameRegex = /^[^\s@]+$/i;
      if (!usernameRegex.test(usernameLocal)) newErrors.username = 'Ingresa un usuario válido';
    }

    const password = formData.password;
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password))
      newErrors.password = 'Debe contener al menos una mayúscula y una minúscula';

    if (!acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    return newErrors;
  };

  const handleRegister = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: 'error', text: extractFirstError(newErrors) || 'Revisa los campos del formulario.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    setLastResponse(null);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        username: `${formData.username.trim().toLowerCase()}${EMAIL_DOMAIN}`,
        password: formData.password,
      };

      const result = await register(payload);
      if (isDev) {
        setLastResponse(result);
        console.log('register(result)', result);
      }

      if (result?.success) {
       
        sessionStorage.setItem('oink:refresh_achievements_after_login', '1');

      
        try { triggerAchievementsRefresh(); } catch (e) { /* noop */ }

        setMessage({ type: 'success', text: '¡Cuenta creada! Te llevamos al inicio de sesión…' });
        setTimeout(() => {
          navigate('/login', { replace: true, state: { justRegistered: true } });
        }, 600);
      } else {
        const fieldErrors =
          result?.errors ||
          (result?.raw && typeof result.raw === 'object' ? result.raw : null) ||
          null;

        const mapped = fieldErrors
          ? Object.fromEntries(
              Object.entries(fieldErrors).map(([k, v]) => [k, Array.isArray(v) ? v.join(' ') : String(v)])
            )
          : {};

        setErrors(mapped);

        const firstMsg =
          mapped.username ||
          mapped.password ||
          mapped.firstName ||
          result?.error ||
          extractFirstError(fieldErrors) ||
          'No se pudo completar el registro.';

        setMessage({ type: 'error', text: firstMsg });
      }
    } catch (err) {
      console.error('Register error:', err);
      setMessage({ type: 'error', text: 'Error de red: no se pudo conectar con el servidor.' });
      if (isDev) setLastResponse({ exception: String(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- SAFE MODE ----------
  if (safeMode) {
    return (
      <div style={{ maxWidth: 520, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
        {message.text && createPortal(
          <div className={`message ${message.type}`}>{message.text}</div>,
          document.body
        )}
        <h2>Registro (modo seguro)</h2>

        <div style={{ marginBottom: 10 }}>
          <label>Nombre</label>
          <input
            style={{ width: '100%', padding: 8 }}
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div style={{ color: 'crimson' }}>{errors.firstName}</div>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Correo</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              style={{ flex: 1, padding: 8 }}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <div style={{ padding: 8, background: '#eee', borderRadius: 4 }}>{EMAIL_DOMAIN}</div>
          </div>
          {errors.username && <div style={{ color: 'crimson' }}>{errors.username}</div>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Contraseña</label>
          <input
            style={{ width: '100%', padding: 8 }}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div style={{ color: 'crimson' }}>{errors.password}</div>}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Acepto los <Link to="/terms-and-conditions">términos y condiciones</Link>
          </label>
          {errors.acceptTerms && <div style={{ color: 'crimson' }}>{errors.acceptTerms}</div>}
        </div>

        <button disabled={isSubmitting || !acceptTerms} onClick={handleRegister}>
          {isSubmitting ? 'Creando…' : 'Crear cuenta'}
        </button>

        {isDev && lastResponse && (
          <pre style={{ marginTop: 12, background: '#f7f7f7', padding: 8, whiteSpace: 'pre-wrap' }}>
{JSON.stringify(lastResponse, null, 2)}
          </pre>
        )}

        <div style={{ marginTop: 12 }}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    );
  }

  // ---------- UI NORMAL ----------
  return (
    <div className="auth-container">
      {message.text && createPortal(
        <div className={`message ${message.type}`}>{message.text}</div>,
        document.body
      )}

      <div className="main-container">
        <div className="register-card">
          <div className="register-left">
            <img src={pigImage} alt="Cerdo Oink" className="pig-image--mock" />
          </div>

          <div className="register-right">
            <h2 className="login-title strong">Crea tu cuenta</h2>
            <p className="login-subtitle">para iniciar ahorrar con Oink</p>

            {/* Nombre */}
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">Nombre</label>
              <div className={`input-wrapper ${errors.firstName ? 'error' : ''}`}>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            {/* Correo */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Correo</label>
              <div className={`email-wrapper ${errors.username ? 'error' : ''}`}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                />
                <span className="email-domain">{EMAIL_DOMAIN}</span>
              </div>
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input with-toggle"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Términos */}
            <div className="form-group">
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="checkbox-input"
                />
                <label htmlFor="acceptTerms" className="checkbox-label">
                  Acepto los <Link to="/terms-and-conditions" className="terms-link">términos y condiciones</Link>
                </label>
              </div>
              {errors.acceptTerms && <span className="form-error">{errors.acceptTerms}</span>}
            </div>

            {/* Botón */}
            <button
              className="login-button pill"
              disabled={isSubmitting || !acceptTerms}
              onClick={handleRegister}
            >
              {isSubmitting ? 'Creando…' : 'Crear cuenta'}
            </button>

            <div className="register-link small">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>

            {isDev && lastResponse && (
              <pre style={{ marginTop: 12, background: '#f7f7f7', padding: 8, whiteSpace: 'pre-wrap' }}>
{JSON.stringify(lastResponse, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoney } from '../../context/MoneyContext';
import { useAuth } from '../../context/AuthContext';
import { FaDollarSign } from 'react-icons/fa';
import pigImage from '../../assets/cerdo.png';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { refreshBalanceFromBackend, setUserAmount } = useMoney();
  const { isAuthenticated } = useAuth();

  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== Helpers =====
  const norm = (s) => String(s || '').trim().toLowerCase();

  // Mapa de clave → ruta (por si solo tenemos la clave)
  const METHOD_ROUTE = {
    '50-30-20': '/metodo-50-30-20',
    'sobres': '/metodo-sobres',
    'automatico': '/ahorro-automatico',
    '1dolar': '/ahorro-1dolar',
    'redondeo': '/metodo-redondeo',
  };

  // ===== Navegación (CUENTA/AUTENTICADO) =====
  // Preferimos ruta guardada; si no, derivamos desde clave.
  const getAccountMethodRoute = () => {
    const route = localStorage.getItem('selectedMethodRouteAuth');
    if (route) return route;

    const key = norm(localStorage.getItem('selectedMethodAuth') || '');
    if (METHOD_ROUTE[key]) return METHOD_ROUTE[key];

    return null;
  };
  const goToAccountMethod = () => {
    const route = getAccountMethodRoute();
    navigate(route || '/metodos', { replace: true });
  };

  // ===== Navegación (PÚBLICO/NO AUTENTICADO) =====
  const getPublicMethodRoute = () => {
    const route = localStorage.getItem('selectedMethodRoutePublic');
    if (route) return route;

    const key = norm(localStorage.getItem('selectedMethodPublic') || '');
    if (METHOD_ROUTE[key]) return METHOD_ROUTE[key];

    return null;
  };
  const goToPublicMethod = () => {
    const route = getPublicMethodRoute();
    navigate(route || '/metodos', { replace: true });
  };

  // ===== Submit (único lugar donde redirigimos) =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(salary);
    if (isNaN(amount) || amount <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return;
    }
    if (amount > 1000000000) {
      setError('El monto no puede exceder 1 billón ($1,000,000,000)');
      return;
    }

    setLoading(true);
    try {
      // Guarda SOLO el último ingreso
      localStorage.setItem('lastIncome', amount.toString());

      const authData = localStorage.getItem('ahorra_oink_auth');

      if (authData) {
        // 🔐 Usuario autenticado: persistir en backend y luego ir DIRECTO al método de la cuenta
        const { token } = JSON.parse(authData);

        const response = await fetch('http://localhost:8000/api/auth/me/set-initial-balance/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        if (response.ok) {
          await refreshBalanceFromBackend();
          goToAccountMethod(); // 👈 ruta del método de la CUENTA
        } else {
          const data = await response.json();
          setError(data.error || 'Error al actualizar el balance');
        }
      } else {
        // 🌐 Visitante (no autenticado): mantener compatibilidad previa
        localStorage.setItem('userTotalAmount', amount.toString());
        localStorage.setItem('userAmountSet', 'true');
        setUserAmount(amount);
        goToPublicMethod(); // 👈 ruta del método PÚBLICO (si existe)
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <main className="stage">
        <div className="hero">
          <div className="pig-wrap" aria-hidden>
            <img src={pigImage} alt="" className="pig pig--flipped" />
          </div>

          <section className="panel">
            <h1 className="title">
              Ingresa tu salario o ingresos y Oink
              <br />
              te ayudará a ahorrar mejor.
            </h1>

            <form className="form" onSubmit={handleSubmit}>
              <label className="input">
                <span className="input__icon-wrap">
                  <FaDollarSign className="input__icon" />
                </span>
                <input
                  type="number"
                  placeholder="Ej: $20.000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  aria-label="Ingresa tu salario"
                  inputMode="decimal"
                  min="0.01"
                  max="1000000000"
                  step="0.01"
                  disabled={loading}
                />
              </label>

              {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

              <button type="submit" className="cta" disabled={loading}>
                {loading ? 'Guardando...' : '¡Comenzar a ahorrar!'}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

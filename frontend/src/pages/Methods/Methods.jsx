import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaPiggyBank,
  FaEnvelope,
  FaRobot,
  FaDollarSign,
  FaCalculator,
  FaLock,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { savingsMethodService } from '../../services/savingsMethodService';
import { temporaryMethodService } from '../../services/temporaryMethodService';
import pigImage from '../../assets/cerdo.png';
import './Methods.css';

const Methods = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentMethod, setCurrentMethod] = useState(null);
  const [canChange, setCanChange] = useState(true);
  const [daysUntilChange, setDaysUntilChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tempMethod, setTempMethod] = useState(null);

  const methods = [
    { id: '50-30-20', title: 'Método 50:30:20', description: 'Distribuye tu dinero en 50% necesidades, 30% deseos y 20% ahorro', icon: FaCalculator, color: '#ff9800', route: '/metodo-50-30-20' },
    { id: 'sobres', title: 'Método de Sobres', description: 'Organiza tu dinero en sobres físicos para cada categoría', icon: FaEnvelope, color: '#4caf50', route: '/metodo-sobres' },
    { id: 'automatico', title: 'Ahorro Automático', description: 'Configura transferencias automáticas a tu cuenta de ahorros', icon: FaRobot, color: '#2196f3', route: '/ahorro-automatico' },
    { id: '1dolar', title: 'Ahorro del $1', description: 'Ahorra $1 cada día y ve cómo crece tu dinero progresivamente', icon: FaDollarSign, color: '#9c27b0', route: '/ahorro-1dolar' },
    { id: 'redondeo', title: 'Método del Redondeo', description: 'Redondea tus gastos y ahorra la diferencia automáticamente', icon: FaPiggyBank, color: '#f44336', route: '/metodo-redondeo' },
  ];

  useEffect(() => {
    document.body.classList.add('methods-page-active');
    checkCurrentMethod();
    checkTemporaryMethod();
    return () => document.body.classList.remove('methods-page-active');
  }, []);

  const checkTemporaryMethod = () => {
    const tempResult = temporaryMethodService.getTemporaryMethod?.();
    if (tempResult?.success && tempResult?.data) {
      setTempMethod(tempResult.data);
    }
  };

  const checkCurrentMethod = async () => {
    try {
      const authData = localStorage.getItem('ahorra_oink_auth');
      if (authData) {
        const result = await savingsMethodService.getCurrentMethod();
        if (result?.success && result?.data) {
          const serverMethod = result.data.method;
          setCurrentMethod(serverMethod);
          setCanChange(result.data.can_change ?? true);
          setDaysUntilChange(result.data.days_until_change || 0);

          const found = methods.find((m) => m.id === serverMethod);
          if (found) {
            localStorage.setItem('selectedMethodAuth', found.id);
            localStorage.setItem('selectedMethodRouteAuth', found.route);
          }
        }
      }
    } catch (err) {
      console.error('Error verificando método actual:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodClick = (method) => {
    if (isAuthenticated && !canChange && currentMethod) {
      alert(`Ya tienes un método de ahorro seleccionado. Debes esperar ${daysUntilChange} días para poder cambiarlo.`);
      return;
    }

    if (isAuthenticated) {
      localStorage.setItem('selectedMethodAuth', method.id);
      localStorage.setItem('selectedMethodRouteAuth', method.route);
    } else {
      localStorage.setItem('selectedMethodPublic', method.id);
      localStorage.setItem('selectedMethodRoutePublic', method.route);
      try {
        temporaryMethodService.setTemporaryMethod
          ? temporaryMethodService.setTemporaryMethod({ method: method.id })
          : temporaryMethodService.saveTemporaryMethod?.(method.id);
        sessionStorage.setItem('methodSelectedInSession', 'true');
      } catch (_) {}
    }
    navigate(method.route);
  };

  const getMethodName = (id) =>
    ({
      '50-30-20': 'Método 50:30:20',
      sobres: 'Método de Sobres',
      automatico: 'Ahorro Automático',
      '1dolar': 'Ahorro del $1',
      redondeo: 'Método del Redondeo',
    }[id] || id);

  const shouldShowMethodSelection = () => {
    if (!isAuthenticated || !currentMethod || canChange) return true;
    return false;
  };

  return (
    <div className="methods-page">
      <div className="methods-header">
        <div className="header-content">
          <div className="header-text">
            {shouldShowMethodSelection() ? (
              <>
                <h1>¡Elige tu método de ahorro!</h1>
                <p>Selecciona el método que mejor se adapte a tu estilo de vida y comienza a ahorrar de manera inteligente.</p>
              </>
            ) : (
              <>
                <h1>Tu Método de Ahorro</h1>
                <p>Aquí está tu metodología de ahorro seleccionada. Puedes cambiarla desde Configuración cuando esté disponible.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {tempMethod && !isAuthenticated && (
        <div className="temp-method-banner">
          <div className="temp-method-title">
            <FaCheckCircle className="temp-method-icon" />
            <h3>¡Método Seleccionado!</h3>
          </div>
          <p className="temp-method-text">
            Has seleccionado: <strong>{getMethodName(tempMethod.method)}</strong>
          </p>
          <p className="temp-method-sub">
            <FaInfoCircle /> Esta metodología se aplicará automáticamente cuando inicies sesión.
          </p>
        </div>
      )}

      <div className="methods-main-container">
        {shouldShowMethodSelection() ? (
          <>
            <div className="methods-column">
              <section className="methods-section">
                <div className="methods-container">
                  <div className="methods-grid">
                    {methods.map((m) => {
                      const Icon = m.icon;
                      return (
                        <div key={m.id} className="method-card" onClick={() => handleMethodClick(m)}>
                          <div className="card-inner">
                            <div className="card-front">
                              <div className="card-icon-container">
                                <div className="card-icon" style={{ backgroundColor: `${m.color}20`, color: m.color }}>
                                  <Icon />
                                </div>
                              </div>
                              <div className="card-text">
                                <h3>{m.title}</h3>
                              </div>
                            </div>
                            <div className="card-back">
                              <div className="card-content-back">
                                <div className="card-description">
                                  <p>{m.description}</p>
                                  <div className="card-action">
                                    <span>Haz clic para comenzar</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>

            <div className="pig-column">
              <div className="pig-container-large">
                <img src={pigImage} alt="Cerdito ahorrador" className="pig-image-large" />
              </div>
            </div>
          </>
        ) : (
          <section className="hero-stack">
            <div className="hero-card">
              {!canChange ? (
                <>
                  <div className="hero-chip hero-chip-warning">
                    <FaLock /> Cambios deshabilitados temporalmente
                  </div>
                  <h1>Método actual: {getMethodName(currentMethod)}</h1>
                  <p>
                    Debes esperar <strong>{daysUntilChange} días</strong> para cambiar de método.
                    Puedes hacerlo desde <strong>Configuración</strong>.
                  </p>
                </>
              ) : (
                <>
                  <div className="hero-chip hero-chip-info">
                    <FaInfoCircle /> Cambios disponibles
                  </div>
                  <h1>Método actual: {getMethodName(currentMethod)}</h1>
                  <p>Ya tienes un método seleccionado. Puedes elegir otro desde <strong>Configuración</strong>.</p>
                </>
              )}
            </div>
            <img className="pig-hero" src={pigImage} alt="Cerdito AhorraInk" />
          </section>
        )}
      </div>
    </div>
  );
};

export default Methods;

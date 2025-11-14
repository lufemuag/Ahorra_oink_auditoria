import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { savingsMethodService } from "../../services/savingsMethodService";
import { temporaryMethodService } from "../../services/temporaryMethodService";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRobot,
  FaPiggyBank,
  FaCalendarDay,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import pigImage from "../../assets/cerdoMoneda.png";
import "./AhorroAutomatico.css";

const AhorroAutomatico = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ========= Presupuesto: SOLO el último ingreso guardado =========
  const lastIncome = useMemo(() => {
    const n = Number(localStorage.getItem("lastIncome") || "0");
    return Number.isFinite(n) ? n : 0;
  }, []);
  const [amount] = useState(lastIncome);

  // ========= Estado de confirmación / selección previa =========
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [alreadySelected, setAlreadySelected] = useState(false);

  // Decor: igual que en “Métodos”
  useEffect(() => {
    document.body.classList.add("methods-page-active");
    return () => document.body.classList.remove("methods-page-active");
  }, []);

  // Redirección si no hay presupuesto base
  useEffect(() => {
    if (!amount || amount <= 0) {
      navigate("/dashboard");
    }
  }, [amount, navigate]);

  // Detectar si ESTE método ya está seleccionado
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (user) {
        const lsIsAuto = localStorage.getItem("selectedMethodAuth") === "automatico";
        if (mounted) setAlreadySelected(lsIsAuto);
        try {
          const res = await savingsMethodService.getCurrentMethod?.();
          const current = res?.success ? res?.data?.method : null;
          if (mounted) setAlreadySelected(current === "automatico");
        } catch (_) {}
      } else {
        const lp = localStorage.getItem("selectedMethodPublic") === "automatico";
        const tmp = temporaryMethodService?.getTemporaryMethod?.();
        const tmpIsAuto = tmp?.success && tmp?.data?.method === "automatico";
        if (mounted) setAlreadySelected(lp || tmpIsAuto);
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [user]);

  const formatCurrency = (v) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v);

  const handleGoBack = () => navigate("/metodos");

  const handleConfirmMethod = async () => {
    setIsConfirming(true);
    try {
      if (user) {
        const res = await savingsMethodService.updateMethod("automatico", amount);
        if (res?.success) {
          localStorage.setItem("selectedMethodAuth", "automatico");
          localStorage.setItem("selectedMethodRouteAuth", "/ahorro-automatico");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      } else {
        const tmp = temporaryMethodService.saveTemporaryMethod?.("automatico", amount);
        if (tmp?.success) {
          localStorage.setItem("selectedMethodPublic", "automatico");
          localStorage.setItem("selectedMethodRoutePublic", "/ahorro-automatico");
          sessionStorage.setItem("methodSelectedInSession", "true");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      }
    } catch (e) {
      console.error("Error al confirmar método:", e);
    } finally {
      setIsConfirming(false);
    }
  };

  // Cálculos UI
  const automaticSavings = Math.max(0, Math.floor(amount * 0.2));
  const availableAmount = Math.max(0, amount - automaticSavings);

  const scheduleOptions = [
    { period: "Diario", amount: automaticSavings / 30, description: "Transferencia diaria" },
    { period: "Semanal", amount: automaticSavings / 4, description: "Transferencia semanal" },
    { period: "Quincenal", amount: automaticSavings / 2, description: "Transferencia quincenal" },
    { period: "Mensual", amount: automaticSavings, description: "Transferencia mensual" },
  ];

  const showConfirm = !alreadySelected && !isConfirmed;

  return (
    <div className="methods-page">
      {/* Header con look & feel de “Métodos” */}
      <header className="methods-header">
        <div className="header-content">
          <button
            className="btn-back"
            onClick={handleGoBack}
            aria-label="Volver a Métodos"
          >
            <FaArrowLeft />
            <span>Volver</span>
          </button>

          <div className="header-text">
            <h1>Ahorro Automático</h1>
            <p>Configura transferencias fijas que alimenten tu ahorro sin pensar.</p>
          </div>
        </div>
      </header>

      {/* Hero centrado con tarjeta + cerdito */}
      <section className="hero-stack">
        <div className="hero-card">
          {alreadySelected ? (
            <div className="hero-chip hero-chip-info">
              <FaInfoCircle /> Método ya seleccionado
            </div>
          ) : (
            <div className="hero-chip hero-chip-warning">
              <FaInfoCircle /> Aún no confirmado
            </div>
          )}
          <h1>Tu presupuesto base</h1>
          <p>
            Presupuesto mensual disponible: <strong>{formatCurrency(amount)}</strong>
          </p>
        </div>
        <img className="pig-hero" src={pigImage} alt="Cerdito Oink" />
      </section>

      {/* Resumen de ahorro automático */}
      <section className="auto-metrics">
        <div className="metrics-grid">
          <article className="metric-card">
            <div className="metric-icon" aria-hidden><FaPiggyBank /></div>
            <div className="metric-body">
              <h3>Ahorro Programado (20%)</h3>
              <p className="metric-amount">{formatCurrency(automaticSavings)}</p>
              <p className="metric-sub">Se separa automáticamente</p>
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-icon" aria-hidden><FaCalendarDay /></div>
            <div className="metric-body">
              <h3>Disponible para gastos</h3>
              <p className="metric-amount">{formatCurrency(availableAmount)}</p>
              <p className="metric-sub">Aproximadamente 80%</p>
            </div>
          </article>
        </div>
      </section>

      {/* Opciones de programación */}
      <section className="schedule-section">
        <div className="schedule-card">
          <h2>Opciones de Programación</h2>
          <div className="options-grid">
            {scheduleOptions.map((o, i) => (
              <article key={i} className="option-card">
                <div className="option-period">{o.period}</div>
                <div className="option-amount">{formatCurrency(Math.floor(o.amount))}</div>
                <div className="option-desc">{o.description}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Confirmación */}
      {showConfirm && (
        <section className="confirmation-section">
          <div className="confirmation-card">
            <div className="confirmation-header">
              <h3>¿Confirmar este método de ahorro?</h3>
              <p>Al confirmar, este método se guardará como tu estrategia de ahorro principal.</p>
            </div>
            <div className="confirmation-actions">
              <button className="btn-cancel" onClick={handleGoBack}>
                Volver a Métodos
              </button>
              <button
                className="btn-confirm"
                onClick={handleConfirmMethod}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <FaCheck className="spinning" /> Confirmando...
                  </>
                ) : (
                  <>
                    <FaCheck /> Confirmar Ahorro Automático
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Éxito */}
      {isConfirmed && (
        <section className="success-section">
          <div className="success-card">
            <div className="success-icon" aria-hidden><FaCheck /></div>
            <h3>¡Método Confirmado!</h3>
            <p>
              {user
                ? "Has seleccionado el Ahorro Automático como tu estrategia de ahorro."
                : "Has seleccionado el Ahorro Automático. Crea tu cuenta para comenzar a aplicarlo."}
            </p>
            <button
              className="btn-continue"
              onClick={() => navigate(user ? "/expenses" : "/register")}
            >
              {user ? "Ir a Gastos" : "Crear Cuenta"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AhorroAutomatico;

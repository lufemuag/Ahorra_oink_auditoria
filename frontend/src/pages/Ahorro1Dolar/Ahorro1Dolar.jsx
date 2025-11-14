import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { savingsMethodService } from "../../services/savingsMethodService";
import { temporaryMethodService } from "../../services/temporaryMethodService";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaDollarSign,
  FaCalendarDay,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import pigImage from "../../assets/cerdoMoneda.png";
import "./Ahorro1Dolar.css";

const Ahorro1Dolar = () => {
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

  // Decor: usa mismo flag de página que Métodos
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
        const lsIsOneDollar = localStorage.getItem("selectedMethodAuth") === "1dolar";
        if (mounted) setAlreadySelected(lsIsOneDollar);
        try {
          const res = await savingsMethodService.getCurrentMethod?.();
          const current = res?.success ? res?.data?.method : null;
          if (mounted) setAlreadySelected(current === "1dolar");
        } catch (_) {}
      } else {
        const lp = localStorage.getItem("selectedMethodPublic") === "1dolar";
        const temp = temporaryMethodService?.getTemporaryMethod?.();
        const tmpIsOne = temp?.success && temp?.data?.method === "1dolar";
        if (mounted) setAlreadySelected(lp || tmpIsOne);
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [user]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  // Confirmar método
  const handleConfirmMethod = async () => {
    setIsConfirming(true);
    try {
      if (user) {
        const result = await savingsMethodService.updateMethod("1dolar", amount);
        if (result?.success) {
          localStorage.setItem("selectedMethodAuth", "1dolar");
          localStorage.setItem("selectedMethodRouteAuth", "/ahorro-1dolar");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      } else {
        const temp = temporaryMethodService.saveTemporaryMethod?.("1dolar", amount);
        if (temp?.success) {
          localStorage.setItem("selectedMethodPublic", "1dolar");
          localStorage.setItem("selectedMethodRoutePublic", "/ahorro-1dolar");
          sessionStorage.setItem("methodSelectedInSession", "true");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      }
    } catch (err) {
      console.error("Error al confirmar método:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleGoBack = () => navigate("/metodos");

  // Parámetros del método $1 (solo UI)
  const dailySavings = 1;
  const monthlySavings = dailySavings * 30;
  const yearlySavings = dailySavings * 365;

  const showConfirm = !alreadySelected && !isConfirmed;

  return (
    <div className="methods-page">
      {/* Header común (idéntico look & feel a Métodos) */}
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
            <h1>Ahorro del $1</h1>
            <p>Ahorra $1 cada día — simple, constante y sin fricción.</p>
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

      {/* Tarjetas de ahorro */}
      <section className="metrics-section">
        <div className="metrics-grid">
          <article className="metric-card">
            <div className="metric-icon"><FaDollarSign /></div>
            <div className="metric-body">
              <h3>Ahorro Diario</h3>
              <p className="metric-amount">{formatCurrency(dailySavings)}</p>
              <p className="metric-sub">Cada día</p>
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-icon"><FaCalendarDay /></div>
            <div className="metric-body">
              <h3>Ahorro Mensual</h3>
              <p className="metric-amount">{formatCurrency(monthlySavings)}</p>
              <p className="metric-sub">En 30 días</p>
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-icon"><FaDollarSign /></div>
            <div className="metric-body">
              <h3>Ahorro Anual</h3>
              <p className="metric-amount">{formatCurrency(yearlySavings)}</p>
              <p className="metric-sub">En 365 días</p>
            </div>
          </article>
        </div>
      </section>

      {/* Confirmación */}
      {showConfirm && (
        <section className="confirmation-section">
          <div className="confirmation-card">
            <div className="confirmation-header">
              <h3>¿Confirmar este método de ahorro?</h3>
              <p>
                Al confirmar, este método se guardará como tu estrategia de ahorro principal.
              </p>
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
                    <FaCheck /> Confirmar Ahorro del $1
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
            <div className="success-icon"><FaCheck /></div>
            <h3>¡Método Confirmado!</h3>
            <p>
              {user
                ? "Has seleccionado el Ahorro del $1 como tu estrategia de ahorro. ¡Comienza a aplicarlo!"
                : "Has seleccionado el Ahorro del $1 como tu estrategia de ahorro. Crea tu cuenta para comenzar a aplicarlo."}
            </p>
            <button
              className="btn-continue"
              onClick={() => {
                if (user) navigate("/expenses");
                else navigate("/register");
              }}
            >
              {user ? "Ir a Gastos" : "Crear Cuenta"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Ahorro1Dolar;

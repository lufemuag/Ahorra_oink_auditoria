import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { savingsMethodService } from "../../services/savingsMethodService";
import { temporaryMethodService } from "../../services/temporaryMethodService";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPiggyBank,
  FaCalculator,
  FaArrowUp,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import pigImage from "../../assets/cerdoMoneda.png";
import "./MetodoRedondeo.css";

const MetodoRedondeo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        const lsIsRedondeo = localStorage.getItem("selectedMethodAuth") === "redondeo";
        if (mounted) setAlreadySelected(lsIsRedondeo);
        try {
          const res = await savingsMethodService.getCurrentMethod?.();
          const current = res?.success ? res?.data?.method : null;
          if (mounted) setAlreadySelected(current === "redondeo");
        } catch (_) {}
      } else {
        const lp = localStorage.getItem("selectedMethodPublic") === "redondeo";
        const temp = temporaryMethodService?.getTemporaryMethod?.();
        const tmpIsRedondeo = temp?.success && temp?.data?.method === "redondeo";
        if (mounted) setAlreadySelected(lp || tmpIsRedondeo);
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
        const r = await savingsMethodService.updateMethod("redondeo", amount);
        if (r?.success) {
          localStorage.setItem("selectedMethodAuth", "redondeo");
          localStorage.setItem("selectedMethodRouteAuth", "/metodo-redondeo");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      } else {
        const t = temporaryMethodService.saveTemporaryMethod?.("redondeo", amount);
        if (t?.success) {
          localStorage.setItem("selectedMethodPublic", "redondeo");
          localStorage.setItem("selectedMethodRoutePublic", "/metodo-redondeo");
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

  // ======= Contenido UI del método =======
  // Ejemplos de redondeo
  const roundingExamples = [
    { original: 1234, rounded: 1300, savings: 66, desc: "Gasto de $1,234 → Redondeo a $1,300 → Ahorro: $66" },
    { original: 567, rounded: 600, savings: 33, desc: "Gasto de $567 → Redondeo a $600 → Ahorro: $33" },
    { original: 2890, rounded: 2900, savings: 10, desc: "Gasto de $2,890 → Redondeo a $2,900 → Ahorro: $10" },
  ];

  const estimatedMonthlySavings = Math.max(0, Math.floor(amount * 0.05)); // 5% estimado

  const showConfirm = !alreadySelected && !isConfirmed;

  return (
    <div className="methods-page">
      {/* Header con look & feel de “Métodos” */}
      <header className="methods-header">
        <div className="header-content">
          <button className="btn-back" onClick={handleGoBack} aria-label="Volver a Métodos">
            <FaArrowLeft />
            <span>Volver</span>
          </button>

          <div className="header-text">
            <h1>Método del Redondeo</h1>
            <p>Redondea tus gastos al alza y ahorra automáticamente la diferencia.</p>
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

      {/* Explicación + Ejemplos */}
      <section className="rounding-section">
        <div className="rounding-container">
          <div className="explanation-card">
            <div className="explanation-content">
              <h3>¿Cómo funciona?</h3>
              <p>
                Cada vez que registras un gasto, lo redondeas hacia arriba (al múltiplo cercano)
                y ahorras la diferencia automáticamente. Así conviertes pequeñas diferencias en
                un ahorro constante.
              </p>
            </div>
          </div>

          <div className="examples-section">
            <h3>Ejemplos de redondeo</h3>
            <div className="examples-grid">
              {roundingExamples.map((ex, i) => (
                <article key={i} className="example-card">
                  <div className="example-amounts">
                    <div className="row">
                      <span className="label">Original</span>
                      <span className="amount">{formatCurrency(ex.original)}</span>
                    </div>
                    <FaArrowUp className="arrow-icon" />
                    <div className="row">
                      <span className="label">Redondeado</span>
                      <span className="amount">{formatCurrency(ex.rounded)}</span>
                    </div>
                    <div className="row">
                      <span className="label">Ahorro</span>
                      <span className="amount savings">{formatCurrency(ex.savings)}</span>
                    </div>
                  </div>
                  <p className="example-desc">{ex.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="estimated-savings">
            <div className="savings-card">
              <div className="card-icon">
                <FaCalculator />
              </div>
              <div className="card-content">
                <h3>Ahorro Estimado Mensual</h3>
                <p className="amount">{formatCurrency(estimatedMonthlySavings)}</p>
                <p className="description">Calculado como 5% de tu presupuesto mensual.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmación */}
      {showConfirm && (
        <section className="confirmation-section">
          <div className="confirmation-card">
            <div className="confirmation-header">
              <h3>¿Confirmar este método de ahorro?</h3>
              <p>Al confirmar, se guardará como tu estrategia principal.</p>
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
                    <FaCheck /> Confirmar Método del Redondeo
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
            <div className="success-icon" aria-hidden>
              <FaCheck />
            </div>
            <h3>¡Método Confirmado!</h3>
            <p>
              {user
                ? "Has seleccionado el Método del Redondeo como tu estrategia de ahorro."
                : "Has seleccionado el Método del Redondeo. Crea tu cuenta para comenzar."}
            </p>
            <button
              className="btn-continue"
              onClick={() => (user ? navigate("/expenses") : navigate("/register"))}
            >
              {user ? "Ir a Gastos" : "Crear Cuenta"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default MetodoRedondeo;

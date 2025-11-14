import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { savingsMethodService } from "../../services/savingsMethodService";
import { temporaryMethodService } from "../../services/temporaryMethodService";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalculator,
  FaHome,
  FaHeart,
  FaPiggyBank,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import pigImage from "../../assets/cerdoMoneda.png";
import "./Method50-30-20.css";

const Method50_30_20 = () => {
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
        const lsIsSelected = localStorage.getItem("selectedMethodAuth") === "50-30-20";
        if (mounted) setAlreadySelected(lsIsSelected);
        try {
          const res = await savingsMethodService.getCurrentMethod?.();
          const current = res?.success ? res?.data?.method : null;
          if (mounted) setAlreadySelected(current === "50-30-20");
        } catch (_) {}
      } else {
        const lp = localStorage.getItem("selectedMethodPublic") === "50-30-20";
        const temp = temporaryMethodService?.getTemporaryMethod?.();
        const tmpIsSelected = temp?.success && temp?.data?.method === "50-30-20";
        if (mounted) setAlreadySelected(lp || tmpIsSelected);
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
        const res = await savingsMethodService.updateMethod("50-30-20", amount);
        if (res?.success) {
          localStorage.setItem("selectedMethodAuth", "50-30-20");
          localStorage.setItem("selectedMethodRouteAuth", "/metodo-50-30-20");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      } else {
        const tmp = temporaryMethodService.saveTemporaryMethod?.("50-30-20", amount);
        if (tmp?.success) {
          localStorage.setItem("selectedMethodPublic", "50-30-20");
          localStorage.setItem("selectedMethodRoutePublic", "/metodo-50-30-20");
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

  // Cálculos 50/30/20 (UI)
  const necessities = Math.max(0, Math.floor(amount * 0.5));
  const wants = Math.max(0, Math.floor(amount * 0.3));
  const savings = Math.max(0, Math.floor(amount * 0.2));

  const cards = [
    {
      title: "Necesidades",
      amount: necessities,
      sub: "50% • Vivienda, comida, transporte",
      Icon: FaHome,
    },
    {
      title: "Deseos",
      amount: wants,
      sub: "30% • Ocio, compras, restaurantes",
      Icon: FaHeart,
    },
    {
      title: "Ahorro",
      amount: savings,
      sub: "20% • Fondo, inversión, metas",
      Icon: FaPiggyBank,
    },
  ];

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
            <h1>Método 50:30:20</h1>
            <p>Distribuye tu dinero de forma equilibrada: 50% necesidades, 30% deseos y 20% ahorro.</p>
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

      {/* Tarjetas de distribución 50/30/20 */}
      <section className="metrics-section">
        <div className="metrics-grid">
          {cards.map(({ title, amount, sub, Icon }, i) => (
            <article key={i} className="metric-card">
              <div className="metric-icon" aria-hidden>
                <Icon />
              </div>
              <div className="metric-body">
                <h3>{title}</h3>
                <p className="metric-amount">{formatCurrency(amount)}</p>
                <p className="metric-sub">{sub}</p>
              </div>
            </article>
          ))}
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
                    <FaCheck /> Confirmar Método 50:30:20
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
                ? "Has seleccionado el Método 50:30:20 como tu estrategia de ahorro."
                : "Has seleccionado el Método 50:30:20. Crea tu cuenta para comenzar a aplicarlo."}
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

export default Method50_30_20;

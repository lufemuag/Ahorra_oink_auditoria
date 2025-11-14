import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { savingsMethodService } from "../../services/savingsMethodService";
import { temporaryMethodService } from "../../services/temporaryMethodService";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaHome,
  FaPiggyBank,
  FaUtensils,
  FaCar,
  FaGamepad,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import pigImage from "../../assets/cerdoMoneda.png";
import "./MethodSobres.css";

const MethodSobres = () => {
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
        const lsIsSobres = localStorage.getItem("selectedMethodAuth") === "sobres";
        if (mounted) setAlreadySelected(lsIsSobres);
        try {
          const res = await savingsMethodService.getCurrentMethod?.();
          const current = res?.success ? res?.data?.method : null;
          if (mounted) setAlreadySelected(current === "sobres");
        } catch (_) {}
      } else {
        const lp = localStorage.getItem("selectedMethodPublic") === "sobres";
        const temp = temporaryMethodService?.getTemporaryMethod?.();
        const tmpIsSobres = temp?.success && temp?.data?.method === "sobres";
        if (mounted) setAlreadySelected(lp || tmpIsSobres);
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
        const r = await savingsMethodService.updateMethod("sobres", amount);
        if (r?.success) {
          localStorage.setItem("selectedMethodAuth", "sobres");
          localStorage.setItem("selectedMethodRouteAuth", "/metodo-sobres");
          setIsConfirmed(true);
          setAlreadySelected(true);
        }
      } else {
        const t = temporaryMethodService.saveTemporaryMethod?.("sobres", amount);
        if (t?.success) {
          localStorage.setItem("selectedMethodPublic", "sobres");
          localStorage.setItem("selectedMethodRoutePublic", "/metodo-sobres");
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

  // Sobres (distribución sugerida)
  const envelopes = [
    {
      title: "Vivienda",
      amount: Math.max(0, Math.floor(amount * 0.35)),
      sub: "Alquiler, servicios, mantenimiento",
      Icon: FaHome,
    },
    {
      title: "Alimentación",
      amount: Math.max(0, Math.floor(amount * 0.25)),
      sub: "Supermercado y comidas",
      Icon: FaUtensils,
    },
    {
      title: "Transporte",
      amount: Math.max(0, Math.floor(amount * 0.15)),
      sub: "Gasolina y transporte público",
      Icon: FaCar,
    },
    {
      title: "Entretenimiento",
      amount: Math.max(0, Math.floor(amount * 0.1)),
      sub: "Hobbies, salidas, diversión",
      Icon: FaGamepad,
    },
    {
      title: "Ahorro",
      amount: Math.max(0, Math.floor(amount * 0.15)),
      sub: "Emergencias y metas",
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
            <h1>Método de Sobres</h1>
            <p>Divide tu presupuesto en sobres por categoría para controlar mejor tus gastos.</p>
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

      {/* Tarjetas de sobres */}
      <section className="envelopes-section">
        <div className="envelopes-grid">
          {envelopes.map(({ title, amount, sub, Icon }, i) => (
            <article key={i} className="envelope-card">
              <div className="envelope-icon" aria-hidden>
                <Icon />
              </div>
              <h3>{title}</h3>
              <p className="envelope-amount">{formatCurrency(amount)}</p>
              <p className="envelope-sub">{sub}</p>
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
                    <FaCheck /> Confirmar Método de Sobres
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
                ? "Has seleccionado el Método de Sobres como tu estrategia de ahorro."
                : "Has seleccionado el Método de Sobres. Crea tu cuenta para comenzar."}
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

export default MethodSobres;

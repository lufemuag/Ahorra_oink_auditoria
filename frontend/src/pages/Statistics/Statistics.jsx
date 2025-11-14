import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { transactionService } from "../../services/transactionService";
import pigImage from "../../assets/CerdoEstadisticas.png";
import {
  FaChartLine,
  FaPiggyBank,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "./Statistics.css";

const Statistics = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState([]);
  const [backendStatistics, setBackendStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isShowingSampleData, setIsShowingSampleData] = useState(false);

  useEffect(() => {
    if (user?.id) loadStatisticsOptimized();
  }, [user]);

  const toBogotaDate = (isoOrYYYYMMDD) => {
    const d = new Date(
      isoOrYYYYMMDD.includes("T") ? isoOrYYYYMMDD : `${isoOrYYYYMMDD}T00:00:00`
    );
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    const y = parts.find((p) => p.type === "year").value;
    const m = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    return `${y}-${m}-${day}`;
  };

  const getLast7DaysKeys = () => {
    const today = new Date();
    const keys = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      keys.push(toBogotaDate(d.toISOString()));
    }
    return keys;
  };


  const computeWeeklyFromTransactions = (transactions) => {
    // El backend ya filtra por usuario, así que procesamos todas las transacciones recibidas
    console.log('Procesando transacciones del usuario:', {
      totalTransactions: transactions.length,
      userId: user?.id,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        date: t.date,
        description: t.description
      }))
    });

    const grouped = {};
    for (const t of transactions) {
      const key = toBogotaDate(`${t.date}T00:00:00`);
      if (!grouped[key]) grouped[key] = { income: 0, expenses: 0, savings: 0 };
      const amount = parseFloat(t.amount) || 0;
      
      console.log(`Procesando transacción: ID=${t.id}, Tipo=${t.type}, Monto=${amount}, Fecha=${t.date}, Key=${key}`);
      
      if (t.type === "income") {
        grouped[key].income += amount;
        console.log(`  -> Agregado a ingresos: ${amount}, Total ingresos para ${key}: ${grouped[key].income}`);
      } else if (t.type === "expense") {
        grouped[key].expenses += amount;
        console.log(`  -> Agregado a gastos: ${amount}, Total gastos para ${key}: ${grouped[key].expenses}`);
      } else if (t.type === "savings") {
        grouped[key].savings += amount;
        console.log(`  -> Agregado a ahorros: ${amount}, Total ahorros para ${key}: ${grouped[key].savings}`);
      } else {
        console.log(`  -> Tipo de transacción no reconocido: ${t.type}`);
      }
    }
    
    console.log('Datos agrupados por fecha:', grouped);

    const keys = getLast7DaysKeys();
    return keys.map((key) => {
      const date = new Date(`${key}T00:00:00`);
      const sums = grouped[key] || { income: 0, expenses: 0, savings: 0 };
      return {
        day: key,
        income: sums.income,
        expenses: sums.expenses,
        savings: sums.savings,
        date,
      };
    });
  };

  const loadStatisticsOptimized = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas del backend
      const result = await transactionService.getStatistics();
      if (!result.success) {
        console.warn('No se pudieron cargar estadísticas del backend:', result.error);
        setBackendStatistics(null);
      } else {
        setBackendStatistics(result.statistics);
      }

      // Cargar transacciones para las gráficas
      const transactionsResult = await transactionService.getTransactions();
      console.log('Resultado de getTransactions:', transactionsResult);
      
      const userTransactions = transactionsResult.success
        ? transactionsResult.transactions
        : [];
      
      console.log('Transacciones del usuario:', userTransactions);
      
      // Generar datos de la gráfica SOLO con datos reales del usuario
      const chartData = computeWeeklyFromTransactions(userTransactions);
      
      // Siempre mostrar datos reales, incluso si están vacíos
      setStatistics(chartData);
      setIsShowingSampleData(false);
      
      console.log('Datos de transacciones cargados:', {
        totalTransactions: userTransactions.length,
        chartData: chartData,
        hasData: chartData.some(day => day.income > 0 || day.expenses > 0 || day.savings > 0),
        chartDataDetails: chartData.map(day => ({
          day: day.day,
          income: day.income,
          expenses: day.expenses,
          savings: day.savings
        }))
      });
      
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Error cargando estadísticas:', e);
      // En caso de error, mostrar datos vacíos (no datos de ejemplo)
      setStatistics([]);
      setIsShowingSampleData(false);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);

  const getMaxValue = () => {
    if (!statistics || statistics.length === 0) {
      return 1000000; // Valor por defecto
    }
    
    const vals = statistics.flatMap((s) => [
      s.income || 0,
      s.expenses || 0,
      s.savings || 0,
    ]);
    
    const maxVal = Math.max(...vals);
    // Asegurar que siempre haya un valor mínimo visible
    return Math.max(maxVal, 100000);
  };

  const getY = (v, h) => {
    const m = getMaxValue();
    return h - (v / m) * h;
  };

  const COLORS = {
    income: "#2e7d32",
    expenses: "#c62828",
    savings: "#1565c0",
  };

  const xPct = (i) =>
    statistics.length > 1 ? (i / (statistics.length - 1)) * 100 : 50;

  const getPoints = (t) => {
    if (!statistics || statistics.length === 0) {
      return [];
    }
    
    return statistics.map((s, i) => ({
      x: xPct(i),
      y: getY(s[t] || 0, 320),
      v: s[t] || 0,
    }));
  };

  const toSmoothPath = (pts, tension = 0.4) => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    const p = pts.map(({ x, y }) => [x, y]);
    let d = `M ${p[0][0]},${p[0][1]}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = i === 0 ? p[0] : p[i - 1];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = i + 2 < p.length ? p[i + 2] : p[p.length - 1];
      const cp1x = p1[0] + ((p2[0] - p0[0]) * tension) / 6;
      const cp1y = p1[1] + ((p2[1] - p0[1]) * tension) / 6;
      const cp2x = p2[0] - ((p3[0] - p1[0]) * tension) / 6;
      const cp2y = p2[1] - ((p3[1] - p1[1]) * tension) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>Revisa tus estadísticas con Oink</h1>
        <p>
          Visualiza de forma clara tus ingresos, gastos y ahorros para llevar un
          control más organizado y tomar mejores decisiones.
        </p>
        <button className="refresh-btn" onClick={() => loadStatisticsOptimized()}>
          <FaChartLine /> Actualizar Estadísticas
        </button>
      </div>

      <div className="last-update-info">
        <FaCalendarAlt />
        <span>Última actualización: {lastUpdate?.toLocaleTimeString()}</span>
        {statistics.length > 0 && statistics.every(day => day.income === 0 && day.expenses === 0 && day.savings === 0) && (
          <div className="no-data-notice">
            <span>📊 No hay transacciones registradas - Agrega ingresos, gastos o ahorros para ver tus estadísticas</span>
          </div>
        )}
      </div>

      <div className="chart-section">
        <div className="chart-container">
          <div className="chart-area">
            <div className="chart-wrapper">
              <div className="grid-lines">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid-line horizontal"></div>
                ))}
              </div>

              <div className="x-bands">
                {statistics.map((_, i) =>
                  i === 0 ? null : (
                    <div
                      key={i}
                      className={`x-band ${i % 2 ? "odd" : "even"}`}
                      style={{
                        left: `${xPct(i - 1)}%`,
                        width: `${xPct(i) - xPct(i - 1)}%`,
                      }}
                    ></div>
                  )
                )}
              </div>

              <div className="y-axis">
                {Array.from({ length: 6 }).map((_, i) => {
                  const v = ((5 - i) / 5) * getMaxValue();
                  return (
                    <div key={i} className="y-label">
                      {v.toLocaleString()}
                    </div>
                  );
                })}
              </div>

              <div className="x-axis">
                {statistics.map((s, i) => (
                  <div
                    key={i}
                    className="x-tick"
                    style={{ left: `${xPct(i)}%` }}
                  >
                    {s.day}
                  </div>
                ))}
              </div>

              {/* Líneas uniformes sin sombra, grosor constante */}
              <div className="chart-lines">
                {["income", "expenses", "savings"].map((t) => {
                  const pts = getPoints(t);
                  const d = toSmoothPath(pts, 0.4);
                  return (
                    <svg
                      key={t}
                      className="line-chart"
                      viewBox="0 0 100 320"
                      preserveAspectRatio="none"
                    >
                      <path
                        d={d}
                        fill="none"
                        stroke={COLORS[t]}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        shapeRendering="geometricPrecision"
                      />
                    </svg>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="totals-grid stats">
            <div className="total-card total-card--income">
              <div className="total-icon">
                <FaArrowUp />
              </div>
              <div className="total-content">
                <h3>Ingresos</h3>
                <p>{formatCurrency(backendStatistics?.total_income || 0)}</p>
              </div>
            </div>

            <div className="total-card total-card--expense">
              <div className="total-icon">
                <FaArrowDown />
              </div>
              <div className="total-content">
                <h3>Gastos</h3>
                <p>{formatCurrency(backendStatistics?.total_expense || 0)}</p>
              </div>
            </div>

            <div className="total-card total-card--savings">
              <div className="total-icon">
                <FaPiggyBank />
              </div>
              <div className="total-content">
                <h3>Ahorros</h3>
                <p>{formatCurrency(backendStatistics?.total_savings || 0)}</p>
              </div>
            </div>
          </div>

          <div className="pig-image-container">
            <img src={pigImage} alt="Cerdito" className="pig-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

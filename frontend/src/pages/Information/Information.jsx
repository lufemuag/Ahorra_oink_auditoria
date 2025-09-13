import React, { useState } from 'react';
import { 
  FaInfoCircle, 
  FaPiggyBank, 
  FaChartLine, 
  FaCalculator,
  FaLightbulb,
  FaBookOpen,
  FaQuestionCircle,
  FaCheckCircle,
  FaArrowRight,
  FaFileContract,
  FaExternalLinkAlt,
  FaStar,
  FaCoins,
  FaPercentage,
  FaCalendarAlt,
  FaWallet,
  FaCreditCard,
  FaChartBar,
  FaShieldAlt,
  FaHandHoldingUsd,
  FaPiggyBank as FaPiggy,
  FaBullseye,
  FaClock,
  FaExclamationTriangle,
  FaThumbsUp,
  FaTimes
} from 'react-icons/fa';
import './Information.css';

const Information = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [userProfile, setUserProfile] = useState({
    monthlyIncome: '',
    currentSavings: '',
    savingsGoal: '',
    timeFrame: '',
    riskLevel: 'conservative'
  });
  const [showRecommendation, setShowRecommendation] = useState(false);

  const savingsMethods = [
    {
      id: '50-30-20',
      name: 'Método 50/30/20',
      icon: FaPercentage,
      description: 'Divide tu ingreso: 50% necesidades, 30% gustos, 20% ahorros',
      details: {
        overview: 'Es la regla más popular y sencilla para organizar tus finanzas. Divide tu ingreso neto en tres categorías principales.',
        steps: [
          '50% para necesidades básicas (vivienda, comida, transporte, servicios)',
          '30% para gustos y entretenimiento (restaurantes, hobbies, compras)',
          '20% para ahorros e inversiones (fondo de emergencia, metas futuras)'
        ],
        pros: ['Fácil de implementar', 'Equilibra necesidades y deseos', 'Garantiza ahorro constante'],
        cons: ['Puede no funcionar con ingresos muy bajos', 'Porcentajes rígidos'],
        ideal: 'Personas con ingresos estables y medianos a altos'
      }
    },
    {
      id: 'fixed-saving',
      name: 'Ahorro Fijo',
      icon: FaCoins,
      description: 'Separa una cantidad fija cada mes antes de gastar',
      details: {
        overview: 'Consiste en apartar una cantidad específica de dinero tan pronto como recibes tu ingreso, antes de cualquier gasto.',
        steps: [
          'Define una cantidad fija que puedas ahorrar consistentemente',
          'Transfiere ese dinero a una cuenta separada el día que cobras',
          'Vive con el resto del dinero disponible',
          'No toques los ahorros excepto para emergencias'
        ],
        pros: ['Muy simple de seguir', 'Crea disciplina', 'Resultados predecibles'],
        cons: ['No se ajusta a cambios en ingresos', 'Puede ser restrictivo'],
        ideal: 'Principiantes en el ahorro o personas con ingresos variables'
      }
    },
    {
      id: 'rounding',
      name: 'Redondeo de Compras',
      icon: FaCalculator,
      description: 'Redondea cada compra al peso superior y ahorra la diferencia',
      details: {
        overview: 'Cada vez que realizas una compra, redondeas al peso superior y la diferencia la apartas como ahorro.',
        steps: [
          'Registra cada compra que realices',
          'Redondea el monto al peso superior más cercano',
          'La diferencia transfiérela a tu cuenta de ahorros',
          'Al final del mes suma todo lo ahorrado'
        ],
        pros: ['Ahorros automáticos', 'Cantidades pequeñas', 'No impacta el presupuesto'],
        cons: ['Ahorros lentos', 'Requiere disciplina para registrar compras'],
        ideal: 'Personas que hacen muchas compras pequeñas y quieren empezar gradualmente'
      }
    },
    {
      id: 'envelope',
      name: 'Método de Sobres',
      icon: FaBookOpen,
      description: 'Asigna dinero en efectivo a diferentes categorías en sobres',
      details: {
        overview: 'Sistema tradicional donde asignas efectivo a diferentes categorías de gastos en sobres físicos o digitales.',
        steps: [
          'Identifica tus categorías de gastos principales',
          'Asigna un presupuesto específico a cada categoría',
          'Coloca el dinero en efectivo en sobres etiquetados',
          'Solo gasta el dinero del sobre correspondiente'
        ],
        pros: ['Control total de gastos', 'Evita el sobregasto', 'Visual y tangible'],
        cons: ['Requiere usar efectivo', 'Poco práctico para compras online'],
        ideal: 'Personas que prefieren el efectivo y necesitan control estricto'
      }
    }
  ];

  const practicalTips = [
    {
      id: 1,
      title: 'Automatiza tus ahorros',
      description: 'Configura transferencias automáticas a tu cuenta de ahorros cada día de pago.',
      icon: FaChartLine,
      category: 'Automático'
    },
    {
      id: 2,
      title: 'Establece metas SMART',
      description: 'Define objetivos Específicos, Medibles, Alcanzables, Relevantes y con Tiempo definido.',
      icon: FaStar,
      category: 'Planificación'
    },
    {
      id: 3,
      title: 'Revisa gastos hormiga',
      description: 'Identifica y controla esos pequeños gastos diarios que se acumulan.',
      icon: FaCalculator,
      category: 'Control'
    },
    {
      id: 4,
      title: 'Crea un fondo de emergencia',
      description: 'Ahorra de 3 a 6 meses de gastos básicos para imprevistos.',
      icon: FaPiggyBank,
      category: 'Seguridad'
    },
    {
      id: 5,
      title: 'Usa la regla de 24 horas',
      description: 'Espera 24 horas antes de realizar compras no esenciales.',
      icon: FaCalendarAlt,
      category: 'Disciplina'
    },
    {
      id: 6,
      title: 'Aprovecha ofertas inteligentemente',
      description: 'Solo compra con descuento lo que realmente necesitabas comprar.',
      icon: FaLightbulb,
      category: 'Inteligente'
    }
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(selectedMethod?.id === method.id ? null : method);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRecommendation = () => {
    const income = parseFloat(userProfile.monthlyIncome);
    const goal = parseFloat(userProfile.savingsGoal);
    const timeFrame = parseInt(userProfile.timeFrame);

    if (income && goal && timeFrame) {
      const monthlyNeeded = goal / timeFrame;
      const savingsPercentage = (monthlyNeeded / income) * 100;

      let recommendedMethod = '';
      let recommendation = '';

      if (savingsPercentage <= 10) {
        recommendedMethod = 'Redondeo de Compras';
        recommendation = `Con ${savingsPercentage.toFixed(1)}% de ahorro necesario, el redondeo de compras es perfecto para ti. Es gradual y no impacta tu presupuesto actual.`;
      } else if (savingsPercentage <= 20) {
        recommendedMethod = 'Ahorro Fijo';
        recommendation = `Necesitas ahorrar ${monthlyNeeded.toLocaleString()} pesos mensuales. Un ahorro fijo te dará la disciplina necesaria para alcanzar tu meta.`;
      } else if (savingsPercentage <= 30) {
        recommendedMethod = 'Método 50/30/20';
        recommendation = `Con ${savingsPercentage.toFixed(1)}% de ahorro requerido, el método 50/30/20 te ayudará a organizar mejor tus finanzas.`;
      } else {
        recommendedMethod = 'Método de Sobres';
        recommendation = `Tu meta requiere ${savingsPercentage.toFixed(1)}% de tus ingresos. Necesitas control estricto, el método de sobres es ideal.`;
      }

      return { recommendedMethod, recommendation, monthlyNeeded, savingsPercentage };
    }
    return null;
  };

  const handleGetRecommendation = (e) => {
    e.preventDefault();
    setShowRecommendation(true);
  };

  return (
    <div className="information-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            <FaInfoCircle className="title-icon" />
            Centro de Información
          </h1>
          <p className="page-subtitle">
            Aprende sobre métodos de ahorro y mejora tu salud financiera
          </p>
        </div>

        {/* Métodos de Ahorro */}
        <section className="info-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaPiggyBank className="section-icon" />
              Métodos de Ahorro
            </h2>
            <p className="section-description">
              Descubre diferentes estrategias para administrar tu dinero y alcanzar tus metas financieras.
            </p>
          </div>

          <div className="methods-grid">
            {savingsMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod?.id === method.id;
              
              return (
                <div key={method.id} className="method-card-wrapper">
                  <div 
                    className={`method-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMethodSelect(method)}
                  >
                    <div className="method-header">
                      <div className="method-icon">
                        <Icon />
                      </div>
                      <h3 className="method-name">{method.name}</h3>
                    </div>
                    <p className="method-description">{method.description}</p>
                    <button className="method-toggle">
                      <FaArrowRight className={isSelected ? 'rotated' : ''} />
                    </button>
                  </div>

                  {isSelected && (
                    <div className="method-details">
                      <div className="detail-overview">
                        <h4>¿Cómo funciona?</h4>
                        <p>{method.details.overview}</p>
                      </div>

                      <div className="detail-steps">
                        <h4>Pasos a seguir:</h4>
                        <ol>
                          {method.details.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="detail-pros-cons">
                        <div className="pros">
                          <h5>✅ Ventajas:</h5>
                          <ul>
                            {method.details.pros.map((pro, index) => (
                              <li key={index}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="cons">
                          <h5>❌ Desventajas:</h5>
                          <ul>
                            {method.details.cons.map((con, index) => (
                              <li key={index}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="detail-ideal">
                        <h5>💡 Ideal para:</h5>
                        <p>{method.details.ideal}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Consejos Prácticos */}
        <section className="info-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaLightbulb className="section-icon" />
              Consejos Prácticos
            </h2>
            <p className="section-description">
              Tips y estrategias probadas para mejorar tu administración financiera.
            </p>
          </div>

          <div className="tips-grid">
            {practicalTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div key={tip.id} className="tip-card">
                  <div className="tip-icon">
                    <Icon />
                  </div>
                  <div className="tip-content">
                    <div className="tip-category">{tip.category}</div>
                    <h3 className="tip-title">{tip.title}</h3>
                    <p className="tip-description">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recomendación Personalizada */}
        <section className="info-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaQuestionCircle className="section-icon" />
              Encuentra tu Método Ideal
            </h2>
            <p className="section-description">
              Responde algunas preguntas y te recomendaremos el mejor método de ahorro para ti.
            </p>
          </div>

          <div className="recommendation-form">
            <form onSubmit={handleGetRecommendation} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Ingreso Mensual (después de impuestos)</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={userProfile.monthlyIncome}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="Ej: 25000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Meta de Ahorro Total</label>
                  <input
                    type="number"
                    name="savingsGoal"
                    value={userProfile.savingsGoal}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="Ej: 50000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tiempo para la meta (meses)</label>
                  <input
                    type="number"
                    name="timeFrame"
                    value={userProfile.timeFrame}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="Ej: 12"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nivel de Riesgo</label>
                  <select
                    name="riskLevel"
                    value={userProfile.riskLevel}
                    onChange={handleProfileChange}
                    className="form-input"
                  >
                    <option value="conservative">Conservador</option>
                    <option value="moderate">Moderado</option>
                    <option value="aggressive">Agresivo</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                <FaCalculator />
                Obtener Recomendación
              </button>
            </form>

            {showRecommendation && (() => {
              const result = calculateRecommendation();
              return result ? (
                <div className="recommendation-result">
                  <div className="result-header">
                    <FaCheckCircle className="result-icon" />
                    <h3>Tu Método Recomendado</h3>
                  </div>
                  
                  <div className="result-content">
                    <div className="result-method">
                      <h4>{result.recommendedMethod}</h4>
                      <p>{result.recommendation}</p>
                    </div>
                    
                    <div className="result-stats">
                      <div className="stat">
                        <span className="stat-label">Ahorro mensual necesario:</span>
                        <span className="stat-value">${result.monthlyNeeded.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Porcentaje de tus ingresos:</span>
                        <span className="stat-value">{result.savingsPercentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </section>

        {/* Consejos Prácticos */}
        <section className="info-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaLightbulb className="section-icon" />
              Consejos Prácticos para Organizar tus Finanzas
            </h2>
            <p className="section-description">
              Aprende estrategias probadas para mejorar tu salud financiera y alcanzar tus metas de ahorro
            </p>
          </div>

          <div className="tips-grid">
            <div className="tip-category">
              <h3 className="category-title">
                <FaWallet className="category-icon" />
                Presupuesto y Control
              </h3>
              <div className="tips-list">
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Registra todos tus gastos</h4>
                    <p>Lleva un registro detallado de cada gasto durante un mes para identificar patrones y oportunidades de ahorro.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Usa la regla de 24 horas</h4>
                    <p>Antes de comprar algo no esencial, espera 24 horas. Muchas veces te darás cuenta de que no lo necesitas.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Automatiza tus ahorros</h4>
                    <p>Configura transferencias automáticas a tu cuenta de ahorros el día que recibes tu salario.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tip-category">
              <h3 className="category-title">
                <FaShieldAlt className="category-icon" />
                Fondo de Emergencia
              </h3>
              <div className="tips-list">
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Mantén 3-6 meses de gastos</h4>
                    <p>Tu fondo de emergencia debe cubrir entre 3 y 6 meses de gastos básicos para imprevistos.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Cuenta separada</h4>
                    <p>Mantén tu fondo de emergencia en una cuenta separada, fácil de acceder pero no tan fácil que lo uses para gastos innecesarios.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Revisa y ajusta regularmente</h4>
                    <p>Revisa tu fondo de emergencia cada 6 meses y ajústalo según cambios en tus gastos o ingresos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tip-category">
              <h3 className="category-title">
                <FaChartLine className="category-icon" />
                Reducción de Gastos
              </h3>
              <div className="tips-list">
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Revisa suscripciones</h4>
                    <p>Cancela servicios que no uses regularmente. Muchas personas pagan por suscripciones que olvidaron.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Compra inteligente</h4>
                    <p>Compara precios, usa cupones, compra en temporada de rebajas y considera marcas genéricas.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Reduce gastos fijos</h4>
                    <p>Negocia tarifas de servicios, cambia a planes más económicos o busca alternativas más baratas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tip-category">
              <h3 className="category-title">
                <FaBullseye className="category-icon" />
                Metas y Motivación
              </h3>
              <div className="tips-list">
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Establece metas SMART</h4>
                    <p>Específicas, Medibles, Alcanzables, Relevantes y con Tiempo definido. Ejemplo: "Ahorrar $50,000 en 12 meses".</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Celebra pequeños logros</h4>
                    <p>Reconoce y celebra cada meta alcanzada, por pequeña que sea. Esto mantiene tu motivación alta.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <FaCheckCircle className="tip-icon" />
                  <div className="tip-content">
                    <h4>Visualiza tu progreso</h4>
                    <p>Usa gráficos, tableros o aplicaciones para ver visualmente cómo avanzas hacia tus metas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="financial-health-check">
            <h3 className="check-title">
              <FaChartBar className="check-icon" />
              Evaluación Rápida de Salud Financiera
            </h3>
            <div className="check-grid">
              <div className="check-item">
                <FaPiggy className="check-item-icon" />
                <div className="check-content">
                  <h4>Fondo de Emergencia</h4>
                  <p>¿Tienes ahorrado al menos 3 meses de gastos básicos?</p>
                </div>
              </div>
              <div className="check-item">
                <FaCreditCard className="check-item-icon" />
                <div className="check-content">
                  <h4>Deudas</h4>
                  <p>¿Tus deudas representan menos del 30% de tus ingresos?</p>
                </div>
              </div>
              <div className="check-item">
                <FaChartLine className="check-item-icon" />
                <div className="check-content">
                  <h4>Ahorro Consistente</h4>
                  <p>¿Ahorras al menos el 10% de tus ingresos mensualmente?</p>
                </div>
              </div>
              <div className="check-item">
                <FaBullseye className="check-item-icon" />
                <div className="check-content">
                  <h4>Metas Claras</h4>
                  <p>¿Tienes metas financieras específicas y un plan para alcanzarlas?</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Términos y Condiciones */}
        <section className="info-section">
          <div className="terms-section">
            <h2 className="section-title">
              <FaFileContract className="section-icon" />
              Términos y Condiciones
            </h2>
            
            <div className="terms-content">
              <div className="terms-intro">
                <p>
                  Al utilizar <strong>Ahorra Oink</strong>, aceptas nuestros términos de servicio y política de privacidad.
                  Esta aplicación es de carácter educativo y las recomendaciones son orientativas.
                </p>
              </div>
              
              <div className="terms-sections">
                <div className="terms-subsection">
                  <h3 className="subsection-title">
                    <FaShieldAlt className="subsection-icon" />
                    Privacidad y Seguridad
                  </h3>
                  <div className="terms-highlights">
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>Tus datos se almacenan localmente en tu dispositivo</span>
                    </div>
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>No compartimos información personal con terceros</span>
                    </div>
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>No recopilamos datos de uso o analíticas</span>
                    </div>
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>Tienes control total sobre tus datos</span>
                    </div>
                  </div>
                </div>

                <div className="terms-subsection">
                  <h3 className="subsection-title">
                    <FaExclamationTriangle className="subsection-icon" />
                    Limitaciones y Responsabilidades
                  </h3>
                  <div className="terms-highlights">
                    <div className="term-item">
                      <FaTimes className="term-icon warning" />
                      <span>Las recomendaciones son sugerencias, no consejos financieros profesionales</span>
                    </div>
                    <div className="term-item">
                      <FaTimes className="term-icon warning" />
                      <span>No garantizamos resultados específicos de ahorro</span>
                    </div>
                    <div className="term-item">
                      <FaTimes className="term-icon warning" />
                      <span>Consulta con un asesor financiero para decisiones importantes</span>
                    </div>
                    <div className="term-item">
                      <FaTimes className="term-icon warning" />
                      <span>Eres responsable de tus decisiones financieras</span>
                    </div>
                  </div>
                </div>

                <div className="terms-subsection">
                  <h3 className="subsection-title">
                    <FaHandHoldingUsd className="subsection-icon" />
                    Uso de la Aplicación
                  </h3>
                  <div className="terms-highlights">
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>La aplicación es gratuita y de uso personal</span>
                    </div>
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>Puedes exportar tus datos en cualquier momento</span>
                    </div>
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>Puedes eliminar tu cuenta y datos cuando desees</span>
                    </div>
                    <div className="term-item">
                      <FaCheckCircle className="term-icon" />
                      <span>La aplicación se actualiza regularmente con mejoras</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="terms-footer">
                <div className="contact-info">
                  <h4>¿Tienes preguntas?</h4>
                  <p>Si tienes dudas sobre estos términos o necesitas ayuda, puedes contactarnos a través de la sección de soporte.</p>
                </div>
                
                <div className="terms-actions">
                  <a 
                    href="#terms-full" 
                    className="terms-link primary"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('En una aplicación real, esto abriría los términos completos en una nueva ventana.');
                    }}
                  >
                    <FaExternalLinkAlt />
                    Leer Términos Completos
                  </a>
                  <a 
                    href="#privacy" 
                    className="terms-link secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('En una aplicación real, esto abriría la política de privacidad.');
                    }}
                  >
                    <FaShieldAlt />
                    Política de Privacidad
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Information;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndConditions.css';
import pigLogo from "../../assets/cerdo.png";


const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleBackToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="terms-container">
      {/* Header */}
      <div className="terms-header">
        <div className="terms-logo">
          <span className="logo-box">AHORRA</span>
          <span className="logo-box">OINK</span>
        </div>
      </div>

      {/* Main content */}
      <div className="terms-main">
        <div className="terms-card">
          <h1 className="terms-title">Términos y Condiciones de Ahorra Oink</h1>
          
          <div className="terms-content">
            {/* Pig illustrations */}
            <div className="pig-left">
              <img 
                src={pigLogo} 
                alt="Cerdo Oink" 
                className="pig-image"
              />
            </div>

            <div className="pig-right">
              <img 
                src={pigLogo} 
                alt="Cerdo Oink" 
                className="pig-image"
              />
            </div>

            <div className="terms-section">
              <h2 className="section-title">1. Datos generales</h2>
              <p><strong>Nombre de la aplicación:</strong> Ahorra Oink.</p>
              <p><strong>Objetivo:</strong> brindar a los usuarios una herramienta digital para organizar sus ingresos, gastos y metas de ahorro de manera sencilla y educativa.</p>
              <p><strong>Versión:</strong> 1.0</p>
              <p><strong>Fecha de última actualización:</strong> 2024</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">2. Aceptación de términos</h2>
              <p>Al utilizar la aplicación Ahorra Oink, el usuario acepta automáticamente estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, debe abstenerse de usar la aplicación.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">3. Uso de la aplicación</h2>
              <p><strong>3.1 Uso permitido:</strong> La aplicación está diseñada para uso personal y educativo en la gestión de finanzas personales.</p>
              <p><strong>3.2 Uso prohibido:</strong> Está prohibido usar la aplicación para actividades ilegales, fraudulentas o que violen derechos de terceros.</p>
              <p><strong>3.3 Responsabilidad del usuario:</strong> El usuario es responsable de la veracidad y exactitud de la información ingresada.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">4. Privacidad y protección de datos</h2>
              <p><strong>4.1 Información personal:</strong> La aplicación puede recopilar información personal del usuario para mejorar la experiencia y funcionalidad.</p>
              <p><strong>4.2 Protección de datos:</strong> Nos comprometemos a proteger la información del usuario según las mejores prácticas de seguridad.</p>
              <p><strong>4.3 Uso de información:</strong> La información recopilada se utilizará únicamente para los fines establecidos en esta aplicación.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">5. Limitaciones de responsabilidad</h2>
              <p><strong>5.1 Exactitud de información:</strong> Aunque nos esforzamos por mantener la información actualizada, no garantizamos la exactitud absoluta de todos los datos.</p>
              <p><strong>5.2 Decisiones financieras:</strong> La aplicación es una herramienta de apoyo y no reemplaza el consejo profesional financiero.</p>
              <p><strong>5.3 Disponibilidad:</strong> No garantizamos la disponibilidad continua de la aplicación.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">6. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la aplicación.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">7. Contacto</h2>
              <p>Para consultas sobre estos términos y condiciones, puede contactarnos a través de la sección de soporte en la aplicación.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">8. Ley aplicable</h2>
              <p>Estos términos y condiciones se rigen por las leyes de Colombia y cualquier disputa será resuelta en los tribunales competentes de este país.</p>
            </div>
          </div>

          {/* Back button */}
          <div className="terms-actions">
            <button 
              className="back-button"
              onClick={handleBackToRegister}
            >
              Volver al Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
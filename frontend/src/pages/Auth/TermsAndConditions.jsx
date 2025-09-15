import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndConditions.css';
import pigLogo from "../../assets/pig.png";


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
                src="/images/pig-left.svg" 
                alt="Cerdo" 
                className="pig-image"
              />
            </div>

            <div className="pig-right">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiBmaWxsPSJ3aGl0ZSIvPgo8IS0tIEJvZHkgLS0+CjxyZWN0IHg9IjMwIiB5PSI3MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjcwIiByeD0iNDAiIHJ5PSIzNSIgZmlsbD0iI2ZmYjNiMyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiLz4KPCEtLSBIZWFkIC0tPgo8Y2lyY2xlIGN4PSI3MCIgY3k9IjUwIiByPSIzNSIgZmlsbD0iI2ZmYjNiMyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiLz4KPCEtLSBIYXQgLS0+CjxyZWN0IHg9IjUwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjE1IiByeD0iMjAiIHJ5PSIwIiBmaWxsPSIjZmY0NDQ0IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8Y2lyY2xlIGN4PSI3MCIgY3k9IjE1IiByPSI4IiBmaWxsPSIjZmY0NDQ0IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8IS0tIEVhcnMgLS0+CjxlbGxpcHNlIGN4PSI0MCIgY3k9IjM1IiByeD0iOCIgcnk9IjEyIiBmaWxsPSIjZmZiM2IzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1KSIvPgo8ZWxsaXBzZSBjeD0iMTAwIiBjeT0iMzUiIHJ4PSI4IiByeT0iMTIiIGZpbGw9IiNmZmIzYjMiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiLz4KPCEtLSBHbGFzc2VzIC0tPgo8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NSIgcng9IjE4IiByeT0iMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxlbGxpcHNlIGN4PSI4MCIgY3k9IjQ1IiByeD0iMTgiIHJ5PSIxNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiLz4KPGxpbmUgeDE9Ijc4IiB5MT0iNDUiIHgyPSI4MiIgeTI9IjQ1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8IS0tIEV5ZXMgLS0+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIiIGZpbGw9IiMwMDAiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI0NSIgcj0iMiIgZmlsbD0iIzAwMCIvPgo8IS0tIFNub3V0IC0tPgo8ZWxsaXBzZSBjeD0iNzAiIGN5PSI2MCIgcng9IjEyIiByeT0iMTAiIGZpbGw9IiNmZjk5OTkiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxlbGxpcHNlIGN4PSI2NiIgY3k9IjU4IiByeD0iMiIgcnk9IjIiIGZpbGw9IiMwMDAiLz4KPGVsbGlwc2UgY3g9Ijc0IiBjeT0iNTgiIHJ4PSIyIiByeT0iMiIgZmlsbD0iIzAwMCIvPgo8IS0tIE1vdXRoIC0tPgo8cGF0aCBkPSJNIDY1IDY1IFEgNzAgNzAgNzUgNjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjwhLS0gQXJtcyAtLT4KPHJlY3QgeD0iMjUiIHk9Ijg1IiB3aWR0aD0iMTAiIGhlaWdodD0iMjAiIHJ4PSI1IiBmaWxsPSIjZmZiM2IzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8cmVjdCB4PSIxMDUiIHk9Ijg1IiB3aWR0aD0iMTAiIGhlaWdodD0iMjAiIHJ4PSI1IiBmaWxsPSIjZmZiM2IzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8IS0tIExlZ3MgLS0+CjxyZWN0IHg9IjUwIiB5PSIxMzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgcng9IjUiIGZpbGw9IiNmZmIzYjMiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxyZWN0IHg9IjgwIiB5PSIxMzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgcng9IjUiIGZpbGw9IiNmZmIzYjMiIHN0cm9rZS13aWR0aD0iMyIvPgo8IS0tIEhvcm5zIC0tPgo8cmVjdCB4PSI0NSIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iNSIgcng9IjMiIHJ5PSIwIiBmaWxsPSIjOGI0NTEzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8cmVjdCB4PSI3NSIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iNSIgcng9IjMiIHJ5PSIwIiBmaWxsPSIjOGI0NTEzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4K" 
                alt="Cerdo" 
                className="pig-image"
              />
            </div>

            <div className="terms-section">
              <h2 className="section-title">1. Datos generales</h2>
              <p><strong>Nombre de la aplicación:</strong> Ahorra Oink.</p>
              <p><strong>Objetivo:</strong> brindar a los usuarios una herramienta digital para organizar sus ingresos, gastos y metas de ahorro de manera sencilla y educativa.</p>
              <p><strong>Administración del servicio:</strong> la aplicación es administrada por el equipo desarrollador de Ahorra Oink.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">2. Condiciones de uso</h2>
              <p>El usuario se compromete a usar la plataforma únicamente con fines personales y educativos relacionados con la gestión de ahorro.</p>
              
              <h3 className="subsection-title">No está permitido:</h3>
              <ul className="terms-list">
                <li>Usar la aplicación para actividades ilegales o fraudulentas.</li>
                <li>Compartir datos falsos o suplantar la identidad de otras personas.</li>
                <li>Intentar manipular, copiar o dañar el sistema.</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2 className="section-title">3. Privacidad y manejo de datos</h2>
              <p><strong>Datos recopilados:</strong> nombre, correo electrónico y contraseña.</p>
              <p><strong>Protección:</strong> los datos se almacenan de manera segura y las contraseñas se guardan en formato encriptado.</p>
              <p><strong>Uso de los datos:</strong> la información es utilizada únicamente para crear y mantener la cuenta del usuario.</p>
              <p><strong>Terceros:</strong> Ahorra Oink no comparte ni vende la información personal de los usuarios a terceros.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">4. Limitaciones del servicio</h2>
              <p>Esta versión inicial de Ahorra Oink no está conectada a bancos ni maneja dinero real.</p>
              <p>Todas las funcionalidades son simulaciones educativas para ayudar al usuario a mejorar sus hábitos de ahorro.</p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">5. Derechos del usuario</h2>
              
              <h3 className="subsection-title">Los usuarios pueden:</h3>
              <ul className="terms-list">
                <li>Modificar sus datos personales desde la configuración de su perfil.</li>
                <li>Eliminar su cuenta de manera definitiva cuando lo deseen.</li>
              </ul>
            </div>

            <div className="terms-contact">
              <p>Contactar al equipo de soporte en caso de dudas o problemas al correo: <strong>soporte@ahorraoink.com</strong></p>
            </div>
          </div>
        </div>

      </div>

      {/* Back button */}
      <div className="terms-footer">
        <button 
          className="back-button"
          onClick={handleBackToRegister}
        >
          Regresar al registro
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import pigImage from '../../assets/CerdoMetodologias.png';
import './Methodologies.css';

const Methodologies = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Agregar clase al body cuando se monta el componente
    document.body.classList.add('methodologies-page-active');
    
    // Limpiar clase del body cuando se desmonta el componente
    return () => {
      document.body.classList.remove('methodologies-page-active');
    };
  }, []);

  const methodologies = [
    {
      id: '50-30-20',
      title: '50-30-20',
      subtitle: 'Método de Distribución',
      description: 'Este método consiste en dividir los ingresos en tres partes: 50% para necesidades básicas como vivienda, transporte y alimentación, 30% para gustos y entretenimiento, y 20% destinado al ahorro o inversión. Es una forma clara y equilibrada de manejar el dinero, porque asegura cubrir lo esencial.'
    },
    {
      id: 'envelope',
      title: 'Método de los Sobres',
      subtitle: 'Sistema de Envelopes',
      description: 'Aquí se organiza el dinero físico en sobres o categorías según los gastos planeados, como comida, transporte, ocio o ahorro. La idea es gastar solo lo que está en cada sobre y no pasarse del límite asignado, lo que ayuda a tener un control más estricto y evitar excesos en ciertas áreas.'
    },
    {
      id: 'automatic-saving',
      title: 'Ahorro Automático',
      subtitle: 'Págate a ti mismo',
      description: 'Este método consiste en apartar una cantidad fija o porcentaje de tus ingresos antes de gastar en otras cosas. Se puede configurar una transferencia automática a una cuenta de ahorros el día que recibes tu salario. Es efectivo porque construye el hábito de ahorrar sin depender demasiado de la fuerza de voluntad.'
    },
    {
      id: '1-percent',
      title: 'Ahorro del 1%',
      subtitle: 'Ahorro Escalonado',
      description: 'Este método empieza con una meta muy baja: ahorrar solo el 1% de tus ingresos. Luego, cada mes aumentas un poco más (2%, 3%, etc.), hasta llegar a un porcentaje mayor. Es ideal para quienes encuentran difícil ahorrar grandes cantidades desde el inicio, ya que el progreso es gradual y menos exigente.'
    },
    {
      id: 'rounding',
      title: 'Método del Redondeo Inteligente',
      subtitle: 'Redondeo Automático',
      description: 'Cada vez que haces una compra, el valor se redondea hacia arriba al número entero o múltiplo más cercano, y la diferencia se guarda como ahorro. Por ejemplo, si pagas $9.200, se registra $10.000 y los $800 restantes se apartan automáticamente. Es útil porque permite ahorrar pequeñas cantidades constantes sin que lo notes demasiado.'
    }
  ];

  return (
    <div className="methodologies-page">
      {/* Header Section */}
      <div className="methodologies-header">
        <div className="header-content">
          <h1>Aprende como funcionan las metodologias que Ahorra Oink te proporciona</h1>
        </div>
      </div>

      {/* Methodologies Cards */}
      <div className="methodologies-content">
        {methodologies.map((method) => (
          <div key={method.id} className="methodology-card">
            <div className="card-content">
              <div className="text-section">
                <h2 className="method-title">{method.title}</h2>
                <h3 className="method-subtitle">{method.subtitle}</h3>
                <p className="method-description">{method.description}</p>
              </div>
              
              <div className="pig-section">
                <div className="pig-image-container">
                  <img 
                    src={pigImage} 
                    alt="Cerdo Oink" 
                    className="pig-image"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Methodologies;
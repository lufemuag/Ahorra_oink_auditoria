import React, { createContext, useContext, useState, useEffect } from 'react';

const MoneyContext = createContext();

export const useMoney = () => {
  const context = useContext(MoneyContext);
  if (!context) {
    throw new Error('useMoney debe ser usado dentro de MoneyProvider');
  }
  return context;
};

export const MoneyProvider = ({ children }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAmountSet, setIsAmountSet] = useState(false);

  const refreshBalanceFromBackend = async () => {
    try {
      const authData = localStorage.getItem('ahorra_oink_auth');
      if (authData) {
        const session = JSON.parse(authData);
        const token = session.token;
        
        const response = await fetch('http://localhost:8000/api/auth/me/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const balance = data.current_balance || 0;
          setTotalAmount(balance);
          if (balance > 0) {
            setIsAmountSet(true);
          }
          localStorage.setItem('userTotalAmount', balance.toString());
          localStorage.setItem('userAmountSet', balance > 0 ? 'true' : 'false');
          console.log('Balance refrescado desde backend:', balance);
        }
      }
    } catch (err) {
      console.error('Error refrescando balance:', err);
    }
  };

  // Exponer la función de refrescar en window para uso global
  useEffect(() => {
    window.refreshMoneyContext = refreshBalanceFromBackend;
    return () => {
      delete window.refreshMoneyContext;
    };
  }, []);

  // Cargar el balance del backend si el usuario está autenticado
  useEffect(() => {
    const loadBalanceFromBackend = async () => {
      try {
        const authData = localStorage.getItem('ahorra_oink_auth');
        if (authData) {
          const session = JSON.parse(authData);
          const token = session.token;
          
          const response = await fetch('http://localhost:8000/api/auth/me/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const balance = data.current_balance || 0;
            setTotalAmount(balance);
            if (balance > 0) {
              setIsAmountSet(true);
            }
            // Limpiar y sincronizar localStorage con el valor del backend
            localStorage.removeItem('userTotalAmount');
            localStorage.removeItem('userAmountSet');
            localStorage.setItem('userTotalAmount', balance.toString());
            localStorage.setItem('userAmountSet', balance > 0 ? 'true' : 'false');
            console.log('Balance cargado del backend:', balance);
            return; // Si se cargó del backend, no cargar del localStorage viejo
          }
        }
      } catch (err) {
        console.error('Error cargando balance del backend:', err);
      }
      
      // Si no hay sesión o falló, cargar del localStorage
      const savedAmount = localStorage.getItem('userTotalAmount');
      const savedIsSet = localStorage.getItem('userAmountSet');
      
      if (savedAmount) {
        setTotalAmount(parseFloat(savedAmount));
      }
      if (savedIsSet === 'true') {
        setIsAmountSet(true);
      }
    };
    
    loadBalanceFromBackend();
  }, []);

  // Guardar en localStorage cuando cambie el monto
  useEffect(() => {
    if (totalAmount > 0) {
      localStorage.setItem('userTotalAmount', totalAmount.toString());
      localStorage.setItem('userAmountSet', 'true');
      setIsAmountSet(true);
    }
  }, [totalAmount]);

  const setUserAmount = (amount) => {
    setTotalAmount(amount);
  };

  const addToAmount = (amount) => {
    setTotalAmount(prevAmount => prevAmount + amount);
  };

  const resetAmount = () => {
    setTotalAmount(0);
    setIsAmountSet(false);
    localStorage.removeItem('userTotalAmount');
    localStorage.removeItem('userAmountSet');
  };


  const value = {
    totalAmount,
    isAmountSet,
    setUserAmount,
    addToAmount,
    resetAmount,
    refreshBalanceFromBackend
  };

  return (
    <MoneyContext.Provider value={value}>
      {children}
    </MoneyContext.Provider>
  );
};

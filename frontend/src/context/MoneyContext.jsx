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

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedAmount = localStorage.getItem('userTotalAmount');
    const savedIsSet = localStorage.getItem('userAmountSet');
    
    if (savedAmount) {
      setTotalAmount(parseFloat(savedAmount));
    }
    if (savedIsSet === 'true') {
      setIsAmountSet(true);
    }
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
    resetAmount
  };

  return (
    <MoneyContext.Provider value={value}>
      {children}
    </MoneyContext.Provider>
  );
};

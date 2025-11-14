import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Expenses.css';

const ExpensesSimple = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    setExpenses([
      { id: 1, description: 'Almuerzo', category: 'Comida', amount: 15000, date: new Date().toISOString() }
    ]);
  }, [user]);

  return (
    <div className="expenses">
      <h1>💸 Mis Gastos (Demo Simple)</h1>
      <button className="add-expense-btn">
        <FaPlus /> Agregar Gasto
      </button>
      {expenses.map(e => (
        <div key={e.id} className="expense-card">
          <p>{e.description} - ${e.amount}</p>
          <button><FaEdit /></button>
          <button><FaTrash /></button>
        </div>
      ))}
    </div>
  );
};

export default ExpensesSimple;

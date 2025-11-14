// src/services/temporaryMethodService.js

const TEMP_METHOD_KEY = 'ahorra_oink_temp_method';
const TEMP_METHOD_DATE_KEY = 'ahorra_oink_temp_method_date';

export const temporaryMethodService = {
  // Guardar método temporalmente en localStorage
  saveTemporaryMethod(method, monthlyIncome) {
    try {
      const tempData = {
        method: method,
        monthly_income: monthlyIncome,
        saved_at: new Date().toISOString()
      };
      
      localStorage.setItem(TEMP_METHOD_KEY, JSON.stringify(tempData));
      localStorage.setItem(TEMP_METHOD_DATE_KEY, new Date().toISOString());
      
      // Marcar que se seleccionó un método en esta sesión
      sessionStorage.setItem('methodSelectedInSession', 'true');
      
      console.log('Método temporal guardado:', tempData);
      return { success: true, data: tempData };
    } catch (error) {
      console.error('Error guardando método temporal:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener método temporal del localStorage
  getTemporaryMethod() {
    try {
      const tempData = localStorage.getItem(TEMP_METHOD_KEY);
      const tempDate = localStorage.getItem(TEMP_METHOD_DATE_KEY);
      
      if (!tempData || !tempDate) {
        return { success: false, data: null };
      }
      
      const parsedData = JSON.parse(tempData);
      return { success: true, data: parsedData };
    } catch (error) {
      console.error('Error obteniendo método temporal:', error);
      return { success: false, error: error.message };
    }
  },

  // Limpiar método temporal del localStorage
  clearTemporaryMethod() {
    try {
      localStorage.removeItem(TEMP_METHOD_KEY);
      localStorage.removeItem(TEMP_METHOD_DATE_KEY);
      // Limpiar también la marca de sesión
      sessionStorage.removeItem('methodSelectedInSession');
      console.log('Método temporal limpiado');
      return { success: true };
    } catch (error) {
      console.error('Error limpiando método temporal:', error);
      return { success: false, error: error.message };
    }
  },

  // Limpiar solo la marca de sesión (mantener el método temporal)
  clearSessionFlag() {
    try {
      sessionStorage.removeItem('methodSelectedInSession');
      console.log('Marca de sesión limpiada');
      return { success: true };
    } catch (error) {
      console.error('Error limpiando marca de sesión:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar si hay método temporal válido (menos de 24 horas)
  hasValidTemporaryMethod() {
    try {
      const tempDate = localStorage.getItem(TEMP_METHOD_DATE_KEY);
      if (!tempDate) return false;
      
      const savedDate = new Date(tempDate);
      const now = new Date();
      const hoursDiff = (now - savedDate) / (1000 * 60 * 60);
      
      // Método temporal válido por 24 horas
      return hoursDiff < 24;
    } catch (error) {
      console.error('Error verificando método temporal:', error);
      return false;
    }
  }
};

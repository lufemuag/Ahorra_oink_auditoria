// Utilidad para generar IDs únicos
export function generateUniqueId() {
  // Generar ID único usando timestamp + número aleatorio + contador
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const counter = Math.floor(Math.random() * 1000);
  return `${timestamp}_${random}_${counter}`;
}

// Función alternativa usando crypto si está disponible
export function generateSecureId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return generateUniqueId();
}







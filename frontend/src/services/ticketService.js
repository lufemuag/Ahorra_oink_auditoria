import { generateUniqueId } from '../utils/idGenerator';

const TICKETS_KEY = 'ahorra_oink_tickets';

export const ticketService = {
  // Crear nuevo ticket
  createTicket: (ticketData) => {
    const tickets = getTickets();
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    const newTicket = {
      id: generateUniqueId(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      username: currentUser.username,
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: []
    };
    
    tickets.push(newTicket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    
    return { success: true, ticket: newTicket };
  },

  // Obtener tickets del usuario actual
  getUserTickets: () => {
    const tickets = getTickets();
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    const userTickets = tickets.filter(ticket => ticket.userId === currentUser.id);
    return { success: true, tickets: userTickets };
  },

  // Obtener todos los tickets (solo admin)
  getAllTickets: () => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado' };
    }
    
    const tickets = getTickets();
    return { success: true, tickets };
  },

  // Actualizar estado del ticket (solo admin)
  updateTicketStatus: (ticketId, status) => {
    if (!isAdmin()) {
      return { success: false, error: 'Acceso denegado' };
    }
    
    const tickets = getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return { success: false, error: 'Ticket no encontrado' };
    }
    
    tickets[ticketIndex].status = status;
    tickets[ticketIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    
    return { success: true, ticket: tickets[ticketIndex] };
  },

  // Agregar respuesta al ticket
  addTicketResponse: (ticketId, message) => {
    const tickets = getTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return { success: false, error: 'Ticket no encontrado' };
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    const newResponse = {
      id: generateUniqueId(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      isAdmin: currentUser.role === 'admin',
      message,
      createdAt: new Date().toISOString()
    };
    
    tickets[ticketIndex].responses.push(newResponse);
    tickets[ticketIndex].updatedAt = new Date().toISOString();
    
    if (currentUser.role === 'admin' && tickets[ticketIndex].status === 'open') {
      tickets[ticketIndex].status = 'in_progress';
    }
    
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    
    return { success: true, ticket: tickets[ticketIndex] };
  },

  // Obtener ticket por ID
  getTicketById: (ticketId) => {
    const tickets = getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
      return { success: false, error: 'Ticket no encontrado' };
    }
    
    const currentUser = getCurrentUser();
    
    // Verificar permisos
    if (!isAdmin() && ticket.userId !== currentUser?.id) {
      return { success: false, error: 'Acceso denegado' };
    }
    
    return { success: true, ticket };
  }
};

// Funciones auxiliares
function getTickets() {
  try {
    const tickets = localStorage.getItem(TICKETS_KEY);
    return tickets ? JSON.parse(tickets) : [];
  } catch (error) {
    console.error('Error parsing tickets data:', error);
    return [];
  }
}

function getCurrentUser() {
  try {
    const auth = localStorage.getItem('ahorra_oink_auth');
    const authData = auth ? JSON.parse(auth) : null;
    return authData?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

function isAdmin() {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'admin';
}
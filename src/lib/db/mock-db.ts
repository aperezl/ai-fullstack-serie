// Tipos de datos para nuestra base de datos simulada
export interface User {
  id: string;
  name: string;
  email: string;
  tickets: string[];
}

export type TicketStatus = 'open' | 'closed' | 'in-progress'

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  userEmail: string;
}

// Nuestra "base de datos" en memoria
const users: User[] = [
  { id: 'usr_1', name: 'Antonio Perez', email: 'antonio@unuko.com', tickets: ['tkt_1', 'tkt_3'] },
  { id: 'usr_2', name: 'Ada Lovelace', email: 'ada@unuko.com', tickets: ['tkt_2'] },
];

const tickets: Ticket[] = [
  { id: 'tkt_1', subject: 'Empezar a escribir un blog', status: 'closed', userEmail: 'antonio@unuko.com' },
  { id: 'tkt_2', subject: 'Consulta sobre el Motor Analítico', status: 'open', userEmail: 'ada@unuko.com' },
  { id: 'tkt_3', subject: 'Terminar la serie AI FullStack', status: 'in-progress', userEmail: 'antonio@unuko.com' },
];

// Funciones que simulan el acceso a la base de datos
export const db = {
  findUserByEmail: async (email: string): Promise<User | undefined> => {
    console.log(`[DB] Buscando usuario por email: ${email}`);
    return users.find(user => user.email === email);
  },
  findTicketsByUserEmail: async (email: string): Promise<Ticket[]> => {
    console.log(`[DB] Buscando tickets para el email: ${email}`);
    return tickets.filter(ticket => ticket.userEmail === email);
  },
  createTicket: async (subject: string, userEmail: string): Promise<Ticket> => {
    console.log(`[DB] Creando ticket para ${userEmail} con asunto: ${subject}`);
    const newTicket: Ticket = {
      id: `tkt_${tickets.length + 1}`,
      subject,
      status: 'open',
      userEmail,
    };
    tickets.push(newTicket);
    // Añadimos el ticket al usuario correspondiente
    const user = await db.findUserByEmail(userEmail);
    user?.tickets.push(newTicket.id);
    return newTicket;
  },
  updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
    console.log(`[DB] Actualizando estado del ticket ${ticketId} a ${status}`);
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      return ticket;
    }
  },
  assignTicketToUser: async (ticketId: string, userEmail: string) => {
    console.log(`[DB] Asignando ticket ${ticketId} al usuario ${userEmail}`);
    const ticket = tickets.find(t => t.id === ticketId);
    const user = await db.findUserByEmail(userEmail);
    if (ticket && user) {
      ticket.userEmail = userEmail;
      if (!user.tickets.includes(ticketId)) {
        user.tickets.push(ticketId);
      }
      return ticket;
    }
  }
};
// Tipos de datos para nuestra base de datos simulada
export interface User {
  id: string;
  name: string;
  email: string;
  tickets: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'in-progress';
  userEmail: string;
}

// Nuestra "base de datos" en memoria
const users: User[] = [
  { id: 'usr_1', name: 'Antonio Perez', email: 'antonio@demandprogress.org', tickets: ['tkt_1', 'tkt_3'] },
  { id: 'usr_2', name: 'Ada Lovelace', email: 'ada@analytic.engine', tickets: ['tkt_2'] },
];

const tickets: Ticket[] = [
  { id: 'tkt_1', subject: 'Problema con la descarga de JSTOR', status: 'closed', userEmail: 'antonio@demandprogress.org' },
  { id: 'tkt_2', subject: 'Consulta sobre el Motor Analítico', status: 'open', userEmail: 'ada@analytic.engine' },
  { id: 'tkt_3', subject: 'Acceso a documentos de PACER', status: 'in-progress', userEmail: 'antonio@demandprogress.org' },
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
};
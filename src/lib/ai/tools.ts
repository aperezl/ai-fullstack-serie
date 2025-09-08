import { tool } from 'ai';
import { z } from 'zod';
import { db } from '../db/mock-db';

// Herramienta de solo lectura
export const findUserTickets = tool({
  description: 'Busca los tickets de soporte para un usuario específico usando su dirección de correo electrónico.',
  inputSchema: z.object({
    email: z.string().email({ message: "Se requiere un correo electrónico válido." }),
  }),
  execute: async ({ email }) => {
    console.log(`[Tool] findUserTickets llamado con email: ${email}`);
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return { error: 'usuario_no_encontrado', message: `El usuario con el email ${email} no existe.` };
      }
      const tickets = await db.findTicketsByUserEmail(email);
      if (tickets.length === 0) {
        return { message: `El usuario ${email} no tiene tickets.` };
      }
      return { tickets };
    } catch (error) {
      return { error: 'error_inesperado', message: 'Ha ocurrido un error al buscar los tickets.' };
    }
  },
})

// Herramientas de escritura
export const createSupportTicket = tool({
  description: 'Crea un nuevo ticket de soporte para un usuario. Devuelve el ticket recién creado.',
  inputSchema: z.object({
    userEmail: z.string().email({ message: "Se requiere un correo electrónico válido para asociar el ticket." }),
    subject: z.string().min(10, { message: "El asunto debe tener al menos 10 caracteres." }),
  }),
  execute: async ({ userEmail, subject }) => {
    try {
      const user = await db.findUserByEmail(userEmail);
      if (!user) {
        return { error: 'usuario_no_encontrado', message: `No se puede crear un ticket para el email ${userEmail} porque el usuario no existe.` };
      }
      const newTicket = await db.createTicket(subject, userEmail);
      return { newTicket };
    } catch (error) {
      return { error: 'creacion_fallida', message: 'No se pudo crear el ticket de soporte.' };
    }
  },
})

export const updataeSupportTicket = tool({
  description: 'Actualiza el estado de un ticket de soporte existente.',
  inputSchema: z.object({
    ticketId: z.string().min(5, { message: "El ID del ticket debe tener al menos 5 caracteres." }),
    status: z.enum(['open', 'closed', 'in-progress'], { message: "El estado debe ser 'open', 'closed' o 'in-progress'." })
  }),
  execute: async ({ ticketId, status }) => {
    try {
      await db.updateTicketStatus(ticketId, status);
      return { message: `El ticket ${ticketId} ha sido actualizado a estado ${status}.` };
    } catch (error) {
      return { error: 'actualizacion_fallida', message: 'No se pudo actualizar el ticket de soporte.' };
    }
  }
})

export const assignTicketToUser = tool({
  description: 'Asigna un ticket de soporte a un usuario específico mediante su correo electrónico.',
  inputSchema: z.object({
    ticketId: z.string().min(5, { message: "El ID del ticket debe tener al menos 5 caracteres." }),
    userEmail: z.string().email({ message: "Se requiere un correo electrónico válido para asignar el ticket." }),
  }),
  execute: async ({ ticketId, userEmail }) => {
    try {
      const user = await db.findUserByEmail(userEmail);
      if (!user) {
        return { error: 'usuario_no_encontrado', message: `No se puede asignar el ticket al email ${userEmail} porque el usuario no existe.` };
      }
      await db.assignTicketToUser(ticketId, userEmail);
      return { message: `El ticket ${ticketId} ha sido asignado al usuario con email ${userEmail}.` };
    } catch (error) {
      return { error: 'asignacion_fallida', message: 'No se pudo asignar el ticket de soporte.' };
    }
  },
})

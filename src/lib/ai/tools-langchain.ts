import { z } from 'zod';
import { db } from '../db/mock-db';
import { DynamicStructuredTool } from "@langchain/core/tools";

// Herramienta de solo lectura
export const findUserTicketsTool = new DynamicStructuredTool({
  name: 'find_user_tickets',
  description: 'Busca los tickets de soporte para un usuario específico usando su dirección de correo electrónico.',
  schema: z.object({
    email: z.string().email({ message: "Se requiere un correo electrónico válido." }),
  }),
  func: async ({ email }) => {
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return `El usuario con el email ${email} no existe.`;
      }
      const tickets = await db.findTicketsByUserEmail(email);
      if (tickets.length === 0) {
        return `El usuario ${email} no tiene tickets.`;
      }
      // Devolvemos un string JSON para que el LLM pueda interpretarlo fácilmente
      return JSON.stringify(tickets);
    } catch (error) {
      return 'Ha ocurrido un error al buscar los tickets.';
    }
  },
});

// Herramienta de escritura
export const createSupportTicketTool = new DynamicStructuredTool({
  name: 'create_support_ticket',
  description: 'Crea un nuevo ticket de soporte para un usuario.',
  schema: z.object({
    userEmail: z.string().email({ message: "Se requiere un correo electrónico válido." }),
    subject: z.string().min(10, { message: "El asunto debe tener al menos 10 caracteres." }),
  }),
  func: async ({ userEmail, subject }) => {
    try {
      const user = await db.findUserByEmail(userEmail);
      if (!user) {
        return `No se puede crear un ticket para ${userEmail} porque el usuario no existe.`;
      }
      const newTicket = await db.createTicket(subject, userEmail);
      return `Ticket creado con éxito. ID: ${newTicket.id}, Estado: ${newTicket.status}.`;
    } catch (error) {
      return 'No se pudo crear el ticket de soporte.';
    }
  },
});

export const updataeSupportTicket = new DynamicStructuredTool({
  name: 'update_support_ticket',
  description: 'Actualiza el estado de un ticket de soporte existente.',
  schema: z.object({
    ticketId: z.string().min(5, { message: "El ID del ticket debe tener al menos 5 caracteres." }),
    status: z.enum(['open', 'closed', 'in-progress'], { message: "El estado debe ser 'open', 'closed' o 'in-progress'." })
  }),
  func: async ({ ticketId, status }) => {
    try {
      await db.updateTicketStatus(ticketId, status);
      return `El ticket ${ticketId} ha sido actualizado a estado ${status}.`;
    } catch (error) {
      return 'No se pudo actualizar el ticket de soporte.';
    }
  }
})

export const assignTicketToUser = new DynamicStructuredTool({
  name: 'assign_ticket_to_user',
  description: 'Asigna un ticket de soporte a un usuario específico mediante su correo electrónico.',
  schema: z.object({
    ticketId: z.string().min(5, { message: "El ID del ticket debe tener al menos 5 caracteres." }),
    userEmail: z.string().email({ message: "Se requiere un correo electrónico válido." }),
  }),
  func: async ({ ticketId, userEmail }) => {
    try {
      const user = await db.findUserByEmail(userEmail);
      if (!user) {
        return `No se puede asignar el ticket al email ${userEmail} porque el usuario no existe.`;
      }
      await db.assignTicketToUser(ticketId, userEmail);
      return `El ticket ${ticketId} ha sido asignado al usuario con email ${userEmail}.`;
    } catch (error) {
      return 'No se pudo asignar el ticket de soporte.';
    }
  }
})

export const langchainTools = [
  findUserTicketsTool,
  createSupportTicketTool,
  updataeSupportTicket,
  assignTicketToUser
];
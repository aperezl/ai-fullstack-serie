import { tool } from 'ai';
import { z } from 'zod';
import { db } from '../db/mock-db';

export const aaronTools = {
  // Herramienta de solo lectura
  findUserTickets: tool({
    description: 'Busca los tickets de soporte para un usuario específico usando su dirección de correo electrónico.',
    inputSchema: z.object({
      email: z.string().email({ message: "Se requiere un correo electrónico válido." }),
    }),
    execute: async ({ email }) => {
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
  }),

  // Herramienta de escritura
  createSupportTicket: tool({
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
  }),
};
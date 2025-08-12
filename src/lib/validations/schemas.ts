import { z } from 'zod'

// Esquema para la entrada de nuestra Server Action
export const GenerateTitlesInputSchema = z.object({
  articleUrl: z
    .string()
    .url({ message: "Por favor, introduce una URL válida." })
    .min(10, { message: "La URL parece demasiado corta." }),
});

// Esquema para la salida que esperamos del LLM
export const AITitlesOutputSchema = z.object({
  titles: z
    .array(z.string().min(10, { message: "El título es demasiado corto." }))
    .length(3, { message: "Esperábamos exactamente 3 títulos." })
    .describe("Un array de 3 títulos clickbait para el artículo."),
});
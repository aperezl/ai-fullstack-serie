'use server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { GenerateTitlesInputSchema, AITitlesOutputSchema } from '@/lib/validations/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Derivamos el tipo de la salida de la IA a partir del schema de Zod
type AITitles = z.infer<typeof AITitlesOutputSchema>;

// Definimos los tipos auxiliares.
export type GenerateTitlesSuccess = {
  success: true;
  data: AITitles;
};

export type GenerateTitlesError = {
  success: false;
  error: string;
};

export type GenerateTitlesResponse = GenerateTitlesSuccess | GenerateTitlesError;

export async function generateClickbaitTitles(
  input: z.infer<typeof GenerateTitlesInputSchema>
): Promise<GenerateTitlesResponse> {
  try {
    // 1. Validar la entrada con nuestro schema. Falla rápido si no es válida.
    const validation = GenerateTitlesInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.flatten().fieldErrors.articleUrl?.[0] || 'Entrada inválida.'
      };
    }

    const { articleUrl } = validation.data;

    // Hacemos fetch a la URL, el contenido HTML de esa petición será lo que analicemos
    const response = await fetch(articleUrl)
    const articleContent = await response.text()

    // 2. Instanciar el modelo y preparar el prompt
    const model = google('gemini-2.0-flash-001');

    const prompt = `
      Eres un experto en SEO y marketing digital con 20 años de experiencia,
      especializado en crear titulares virales.
      Analiza el siguiente contenido de un artículo y genera exactamente
       3 títulos clickbait optimizados para redes sociales.
      Los títulos deben ser provocativos, cortos y generar curiosidad.
      No añadas ninguna explicación, solo devuelve el objeto JSON con la estructura requerida.
      Contenido del artículo: "${articleContent}"
    `;

    // 3. Llamar a la IA con generateObject para obtener una salida estructurada
    const { object } = await generateObject({
      model: model,
      schema: AITitlesOutputSchema, // Le decimos a la IA la "forma" que debe tener su respuesta
      prompt: prompt,
    });

    // La validación contra AITitlesOutputSchema ya la hace 'generateObject' por nosotros.
    // Si la forma no es correcta, la función lanzará un error que capturaremos.

    revalidatePath('/'); // Opcional: Invalida el caché de la página si es necesario.

    return { success: true, data: object };

  } catch (e) {
    console.error(e);
    // Para un sistema en producción, aquí registraríamos el error en un servicio de logging.
    return {
      success: false,
      error: 'Ha ocurrido un error al contactar con la IA. Por favor, inténtalo de nuevo.'
    };
  }
}
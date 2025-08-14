'use client';

import { useState } from 'react';
import { generateClickbaitTitles } from '@/lib/ai/actions';
import type { z } from 'zod';
import type { AITitlesOutputSchema } from '@/lib/validations/schemas';

// Definimos un tipo local para el estado de los resultados
type TitlesData = z.infer<typeof AITitlesOutputSchema>;

export default function HomePage() {
  // Estado para manejar el estado de carga de la Server Action
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para almacenar los títulos generados por la IA
  const [titlesData, setTitlesData] = useState<TitlesData | null>(null);
  // Estado para manejar cualquier error devuelto por la acción
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setTitlesData(null);

    const formData = new FormData(event.currentTarget);
    const articleUrl = formData.get('articleUrl') as string;

    const result = await generateClickbaitTitles({ articleUrl });

    if (result.success) {
      setTitlesData(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-amber-400">
        Generador de títulos virales con IA
      </h1>
      <div className='p-5 border-2 rounded-2xl bg-slate-700 border-slate-500'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="articleUrl" className="font-semibold">
            URL del Artículo
          </label>
          <input
            id="articleUrl"
            name="articleUrl"
            type="url"
            required
            placeholder="https://ejemplo.com/mi-articulo-genial"
            className="p-2 border rounded-md shadow-sm bg-slate-300 text-gray-900 focus:ring-amber-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-500 disabled:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Generando...' : 'Generar Títulos'}
          </button>
        </form>

        {/* Sección de Resultados y Errores */}
        <div className="mt-10">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {titlesData && (
            <div className="bg-slate-300 text-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sugerencias de Títulos:</h2>
              <ul className="list-disc list-inside space-y-2">
                {titlesData.titles.map((title, index) => (
                  <li key={index} className="text-shadow-md">
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isLoading && (
            <div className="text-center pt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
              <p className="mt-4 text-gray-200">La IA está pensando... por favor espera.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
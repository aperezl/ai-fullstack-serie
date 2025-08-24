import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import { chunks  } from '../src/lib/db/schema'; 
import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  // 1. Obtener la frase de búsqueda de los argumentos de la línea de comandos
  const query = process.argv[2];

  if (!query) {
    console.error('Por favor, proporciona una frase para buscar.');
    console.log('Uso: node search.js "tu frase de búsqueda"');
    process.exit(1);
  }

  console.log(`Buscando resultados para: "${query}"...`);

  // 2. Conectar a la base de datos
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('La variable de entorno DATABASE_URL no está definida.');
  }
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  console.log('Conectado a la base de datos.');

  // 3. Generar el embedding para la frase de búsqueda
  const embeddingModel = google.textEmbedding('text-embedding-004');
  console.log('Generando embedding para la consulta...');
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });
  console.log('Embedding generado.');

  // 4. Realizar la búsqueda por similitud en la base de datos
  // Usamos el operador <=> (distancia coseno) de pgvector para encontrar los vectores más cercanos.
  // Un valor más bajo significa que son más similares.
  const distance = sql`embedding <=> ${JSON.stringify(embedding)}`;

  console.log('Realizando búsqueda por similitud en la base de datos...');
  const searchResults = await db
    .select({
      content: chunks.content,
      similarity: distance, // Esta es la "distancia", no la similitud. 0 = idéntico.
    })
    .from(chunks)
    .orderBy(distance) // Ordenamos por la distancia para obtener los más cercanos primero
    .limit(5); // Obtenemos los 5 resultados más relevantes

  // 5. Mostrar los resultados
  if (searchResults.length === 0) {
    console.log('No se encontraron resultados.');
  } else {
    console.log('\n--- Resultados más relevantes ---');
    searchResults.forEach((result, index) => {
      console.log(`\n[ Resultado ${index + 1} | Distancia: ${result.similarity.toFixed(4)} ]`);
      console.log(result.content);
      console.log('---------------------------------');
    });
  }

  // 6. Cerrar la conexión
  await client.end();
  console.log('\nBúsqueda finalizada.');
}

main().catch((error) => {
  console.error('Ha ocurrido un error en el script de búsqueda:', error);
  process.exit(1);
});
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chunks as chunksSchema } from '../src/lib/db/schema'; // Renombrado para evitar conflicto de nombres
import { promises as fs } from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Función auxiliar para dividir un array en lotes de un tamaño específico
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function main() {
  console.log('Iniciando pipeline de ingesta...');

  // 1. Conectar a la base de datos
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('La variable de entorno POSTGRES_URL no está definida.');
  }
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);
  console.log('Conectado a la base de datos.');

  // 2. Cargar y Extraer Texto del Documento
  const filePath = path.join(process.cwd(), 'data', 'book.md');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  console.log('Documento cargado.');

  // 3. Chunking (División) del Documento
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
  });
  const textChunks = await splitter.splitText(fileContent);
  console.log(`Documento dividido en ${textChunks.length} chunks.`);

  // Define el tamaño del lote
  const BATCH_SIZE = 100;
  const textChunksBatches = chunkArray(textChunks, BATCH_SIZE);

  console.log(`Procesando en ${textChunksBatches.length} lotes de hasta ${BATCH_SIZE} chunks cada uno.`);

  for (let i = 0; i < textChunksBatches.length; i++) {
    const batch = textChunksBatches[i];
    console.log(`Procesando lote ${i + 1}/${textChunksBatches.length} con ${batch.length} chunks...`);

    // 4. Generación de Embeddings para el lote actual
    const embeddingModel = google.textEmbedding('text-embedding-004');
    console.log('Generando embeddings para el lote...');
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: batch,
    });
    console.log(`Se generaron ${embeddings.length} embeddings para el lote.`);

    // 5. Almacenamiento en la Base de Datos Vectorial para el lote actual
    const dataToInsert = batch.map((content, j) => ({
      content,
      embedding: embeddings[j],
    }));

    console.log('Insertando chunks y embeddings del lote en la base de datos...');
    await db.insert(chunksSchema).values(dataToInsert);
    console.log(`¡Inserción del lote ${i + 1} completada!`);
  }


  // Cerrar la conexión
  await client.end();
  console.log('Pipeline de ingesta finalizada con éxito.');
}

main().catch((error) => {
  console.error('Ha ocurrido un error en la pipeline de ingesta:', error);
  process.exit(1);
});
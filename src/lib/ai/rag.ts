import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chunks } from '../db/schema';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import { sql } from 'drizzle-orm';

// Conexión a la BBDD (reutilizable)
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

const embeddingModel = google.textEmbedding('text-embedding-004');

export async function findRelevantChunks(query: string, k: number = 3) {
  // 1. Generar el embedding para la pregunta del usuario
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  // 2. Búsqueda de similitud en la base de datos vectorial
  const similarity = sql<number>`1 - (${chunks.embedding} <=> ${JSON.stringify(embedding)})`;

  const relevantChunks = await db
    .select({
      content: chunks.content,
      similarity: similarity,
    })
    .from(chunks)
    .where(sql`${similarity} > 0.5`) // Umbral de similitud para filtrar resultados irrelevantes
    .orderBy((t) => sql`(${t.similarity}) DESC`)
    .limit(k);

  return relevantChunks;
}
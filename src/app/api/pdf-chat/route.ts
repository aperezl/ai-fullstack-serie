// app/api/pdf-chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, UIMessage, UIMessagePart } from 'ai';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from 'langchain/document';

export const maxDuration = 60;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


const extractPdfAsBlob = async (parts: UIMessagePart[]): Blob | undefined => {
  console.log({ parts })
  const filePart = parts.find(part => part.type === 'file' && part.mediaType === 'application/pdf');
  if (filePart) {
    console.log({ filePart })
    const x = await fetch(filePart.url);
    const y = new Blob([await x.blob()], { type: 'application/pdf' });
    return y
  }
  return undefined;
};

const PostBodySchema = z.object({
  messages: z.array(z.any()),
  id: z.string(),
});

interface SerializedVectorStore {
  docs: {
    pageContent: string;
    embedding: number[];
  }[];
}

async function processAndCachePdf(pdfBlob: Blob, sessionId: string) {
  console.log(`[CAG] Iniciando procesamiento de PDF para sessionId: ${sessionId}`);
  const loader = new WebPDFLoader(pdfBlob);
  const docs = await loader.load();
  console.log(`[CAG] PDF cargado. Páginas: ${docs.length}`);

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1024, chunkOverlap: 100 });
  const chunks = await splitter.splitDocuments(docs);
  console.log(`[CAG] Texto dividido en ${chunks.length} chunks.`);
  if (chunks.length === 0) return;

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    modelName: "text-embedding-004"
  });
  const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
  console.log('[CAG] VectorStore en memoria creado.');

  const serializedVectorStore = JSON.stringify({
    docs: vectorStore.memoryVectors.map((vector, i) => ({
      pageContent: chunks[i].pageContent,
      embedding: vector.embedding
    })),
  });

  await redis.set(`pdf_cache:${sessionId}`, serializedVectorStore, { ex: 3600 });
  console.log(`[CAG] VectorStore para sessionId ${sessionId} guardado en Redis.`);
}

async function findRelevantCachedChunks(query: string, sessionId: string): Promise<string[]> {
  const serializedData = await redis.get<string>(`pdf_cache:${sessionId}`);
  if (!serializedData) return [];

  console.log({ serializedData: serializedData.docs })
  const { docs }: SerializedVectorStore = serializedData

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    modelName: "text-embedding-004"
  });

  const documents = docs.map(doc => new Document({ pageContent: doc.pageContent }));
  const precomputedEmbeddings = docs.map(doc => doc.embedding);

  const vectorStore = new MemoryVectorStore(embeddings);
  await vectorStore.addVectors(precomputedEmbeddings, documents);

  console.log(`[CAG] Buscando chunks relevantes para la query: "${query}"`);
  const results = await vectorStore.similaritySearch(query, 4);

  return results.map(result => result.pageContent);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = PostBodySchema.safeParse(body);
    console.log('[CAG] Petición recibida:', validation);
    if (!validation.success) {
      return new Response(JSON.stringify(validation.error.flatten()), { status: 400 });
    }

    const { messages, id }: { messages: UIMessage[]; id: string } = validation.data;
    const lastUserMessage = messages[messages.length - 1];

    if (!lastUserMessage || !Array.isArray(lastUserMessage.parts)) {
      return new Response("Mensaje de usuario inválido", { status: 400 });
    }

    const userText = lastUserMessage.parts.filter(part => part.type === 'text').map(part => (part as any).text).join(' ');
    const pdfBlob = await extractPdfAsBlob(lastUserMessage.parts);
    console.log('[CAG] Texto del usuario:', userText);
    console.log('[CAG] PDF adjunto:', pdfBlob ? 'Sí' : 'No');
    if (pdfBlob) {
      console.log(`[CAG] Procesando nuevo PDF para sessionId: ${id}`);
      await processAndCachePdf(pdfBlob, id);
      console.log(`[CAG] PDF procesado y cacheado para sessionId: ${id}`);
      const result = streamText({
        model: google('gemini-2.0-flash-001'),
        prompt: "He procesado el documento PDF. ¿Qué te gustaría saber sobre él?"
      });
      console.log(`[CAG] Respuesta inicial enviada para sessionId: ${id}`);
      return result.toUIMessageStreamResponse();
    }

    console.log(`[CAG] Buscando en caché para sessionId: ${id}`);
    const relevantChunks = await findRelevantCachedChunks(userText, id);
    console.log(`[CAG] Chunks relevantes encontrados: ${relevantChunks.length}`);
    const context = relevantChunks.join('\n---\n');

    const systemPrompt = `
      Eres un asistente experto en analizar documentos. Responde a la pregunta del usuario basándote
      únicamente en el siguiente contexto extraído del PDF que te ha proporcionado.
      Si la respuesta no se encuentra en el contexto, indica amablemente que no puedes encontrar esa
      información en el documento.

      Contexto del Documento:
      ---
      ${context}
      ---
    `;

    console.log('[CAG] Llamando al modelo con el prompt y contexto.');
    console.log({ systemPrompt })
    const result = await streamText({
      model: google('gemini-2.0-flash-001'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    });

    console.log(`[CAG] Respuesta generada para sessionId: ${id}`);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error en la API de PDF-Chat (CAG):", error);
    return new Response("Error al procesar el PDF.", { status: 500 });
  }
}
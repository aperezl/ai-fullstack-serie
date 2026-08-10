

# Agente de IA Full-Stack: El Código Detrás de la Serie de Artículos

![Banner del Proyecto](https://aperezl.com/images/rag-dotando-de-memoria-a-tu-agente-parte-1/image.png)

<p align="center">
  <em>El código fuente completo que acompaña a la serie de artículos en <a href="https://aperezl.com" target="_blank">aperezl.com</a> sobre cómo construir aplicaciones de IA de extremo a extremo.</em>
</p>

---

## 🚀 Sobre este Proyecto

Este repositorio contiene la implementación práctica y el código fuente de la serie de artículos que estoy escribiendo sobre la creación de un **Ingeniero de IA Full-Stack** utilizando un stack moderno basado en TypeScript.

El objetivo es doble:

1.  **Servir como una implementación de referencia** para los conceptos teóricos explicados en el blog.
2.  **Actuar como un proyecto de portfolio vivo**, demostrando las mejores prácticas en la construcción de aplicaciones de IA robustas, escalables y centradas en el usuario.

## 🔗 La Serie de Artículos del Blog

Para entender el contexto, la arquitectura y las decisiones detrás del código, te recomiendo encarecidamente leer la serie de artículos en orden:

*   **Fundamentos modernos y primera interacción con IA:**
    *   [Parte 1](https://aperezl.com/post/fundamentos-modernos-y-primera-interaccion-con-ia-parte-1)
    *   [Parte 2](https://aperezl.com/post/fundamentos-modernos-y-primera-interaccion-con-ia-parte-2)
    *   [Parte 3](https://aperezl.com/post/fundamentos-modernos-y-primera-interaccion-con-ia-parte-3)
*   **Construyendo Interfaces Conversacionales:**
    *   [Parte 1](https://aperezl.com/post/construyendo-interfaces-conversacionales-parte-1)
    *   [Parte 2](https://aperezl.com/post/construyendo-interfaces-conversacionales-parte-2)
    *   [Parte 3](https://aperezl.com/post/construyendo-interfaces-conversacionales-parte-3)
*   **RAG - Dotando de Memoria a tu Agente:**
    *   [Parte 1](https://aperezl.com/post/rag-dotando-de-memoria-a-tu-agente-parte-1)
    *   [Parte 2](https://aperezl.com/post/rag-dotando-de-memoria-a-tu-agente-parte-2)
    *   [Parte 3](https://aperezl.com/post/rag-dotando-de-memoria-a-tu-agente-parte-3)
*   **RAG Avanzado y Agentes Multi-modales**
    *   [Parte 1](https://aperezl.com/post/rag-avanzado-y-agentes-multi-modales-parte-1)
    *   [Parte 2](https://aperezl.com/post/rag-avanzado-y-agentes-multi-modales-parte-2)

*(Esta sección se actualizará a medida que se publiquen nuevos artículos)*

## ✨ Características y Tecnologías Clave

Este proyecto demuestra el uso de un stack de vanguardia para la IA:

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Arquitectura:** React Server Components (RSC) y Server Actions
*   **Librería de IA:** [Vercel AI SDK](https://sdk.vercel.ai/) para streaming y hooks de UI.
*   **Orquestación de Agentes:** [LangChain.js](https://js.langchain.com/) para cadenas y lógica de agentes.
*   **Memoria (RAG):** Base de datos vectorial con [PostgreSQL](https://www.postgresql.org/) y la extensión [pgvector](https://github.com/pgvector/pgvector).
*   **Validación de Esquemas:** [Zod](https://zod.dev/) para validar datos y esquemas de herramientas (Function Calling).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) y [Shadcn/ui](https://ui.shadcn.com/) para los componentes.

## 🛠️ Cómo Empezar: Puesta en Marcha Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### **1. Requisitos Previos**
*   [Node.js](https://nodejs.org/) (versión 18 o superior)
*   [npm](https://www.npmjs.com/) o `pnpm`
*   [Docker](https://www.docker.com/) (para levantar una instancia de PostgreSQL fácilmente)
*   Una API Key de [Google AI Studio](https://aistudio.google.com/).

### **2. Instalación**

```bash
# 1. Clona el repositorio
git clone https://github.com/aperezl/ai-fullstack-serie.git

# 2. Navega al directorio del proyecto
cd ai-fullstack-serie

# 3. Instala las dependencias
npm install
```

### **3. Configuración del Entorno**

```bash
# 1. Copia el fichero de ejemplo para las variables de entorno
cp example.env .env.local

# 2. Abre el fichero .env.local y añade tus claves de API y la URL de tu base de datos.
```

Tu fichero `.env.local` debería tener este aspecto:

```env
# Clave de API de Google (Gemini)
GOOGLE_API_KEY="AIzaSy..."

# URL de conexión a tu base de datos PostgreSQL con pgvector
# Si usas Docker, podría ser algo así:
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

> **Nota Importante:** Necesitas una instancia de PostgreSQL en ejecución con la extensión `pgvector` habilitada. Puedes usar Docker para levantar una fácilmente.


### **4. Ejecutar la Aplicación**

```bash
# Inicia el servidor de desarrollo
npm run dev
```

¡Abre [http://localhost:3000](http://localhost:3000) en tu navegador y deberías ver la aplicación funcionando!

## 📂 Estructura del Proyecto

```
/
├── app/              # Rutas, páginas y layouts (Next.js App Router)
├── components/       # Componentes de React (UI)
├── lib/              # Lógica de negocio principal
│   ├── ai/           # Funciones relacionadas con LLMs, LangChain, etc.
│   ├── db/           # Lógica de la base de datos, esquemas
│   └── utils.ts      # Funciones de utilidad
├── scripts/          # Scripts de utilidad 
└── public/           # Archivos estáticos
```

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el fichero `LICENSE` para más detalles.

---

<p align="center">
  Hecho con ❤️ desde Andalucía por <strong>Antonio Pérez</strong>
  <br/>
  <a href="https://aperezl.com">Blog</a> | <a href="https://github.com/aperezl">GitHub</a>
</p>

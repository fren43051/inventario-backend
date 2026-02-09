# Inventario Backend

Backend API para análisis de documentos y chatbot con integración de Azure AI.

## Descripción

Este proyecto proporciona una API REST para:
- Análisis de documentos usando Azure Document Intelligence
- Chatbot con Azure OpenAI
- Gestión y procesamiento de archivos

## Tecnologías

- **Node.js** con Express.js
- **Azure AI Form Recognizer** - Análisis de documentos
- **Azure OpenAI** - Modelo de lenguaje para chatbot
- **Multer** - Carga de archivos
- **Axios** - Cliente HTTP
- **Winston** - Logging
- **CORS** - Middleware de seguridad

## Requisitos

- Node.js 18 o superior
- Cuenta de Azure con acceso a:
  - Azure Document Intelligence
  - Azure OpenAI

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd inventario-backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno creando un archivo `.env`:

```env
# Azure Document Intelligence
DOC_INTEL_ENDPOINT=https://tu-recurso.cognitiveservices.azure.com/
DOC_INTEL_KEY=tu-clave-de-document-intelligence

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://tu-recurso.openai.azure.com/
AZURE_OPENAI_API_KEY=tu-clave-de-openai
AZURE_OPENAI_DEPLOYMENT=nombre-del-deployment
AZURE_OPENAI_API_VERSION=2023-07-31
```

## Uso

### Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## API Endpoints

### Document Intelligence

#### POST `/api/document-intel/analyze`
Analiza un documento y extrae su contenido.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (documento para analizar)

**Response:**
```json
{
  "success": true,
  "operationLocation": "url-de-operacion",
  "data": {
    "status": "succeeded"
  }
}
```

#### GET `/api/document-intel/result`
Obtiene el resultado de un análisis previo.

**Request:**
- Method: `GET`
- Query params: `url` (URL de operación de Azure)

**Response:**
```json
{
  "status": "succeeded",
  "analyzeResult": {}
}
```

#### POST `/api/document-intel/ask`
Realiza preguntas sobre el contenido de un documento usando Azure OpenAI.

**Request:**
```json
{
  "question": "¿Cuál es el tema principal?",
  "documentContent": "Contenido del documento..."
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Respuesta generada por el modelo"
}
```

### Chat

`/api/chat/*` - Endpoints para interacción con chatbot

### Files

`/api/files/*` - Endpoints para gestión de archivos

## Estructura del Proyecto

```
inventario-backend/
├── src/
│   ├── app.js                 # Punto de entrada de la aplicación
│   ├── config/                # Configuración
│   ├── controllers/           # Controladores
│   ├── middleware/            # Middleware personalizado
│   ├── routes/                # Definición de rutas
│   │   ├── chat.routes.js
│   │   ├── file.routes.js
│   │   └── document-intel.routes.js
│   ├── services/              # Lógica de negocio
│   └── utils/                 # Utilidades
├── .env                       # Variables de entorno (no incluido en git)
├── package.json
└── README.md
```

## Licencia

[Especificar licencia]

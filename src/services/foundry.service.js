import axios from "axios";
import { getConversation } from "./conversation.service.js";
import { logger } from "../utils/logger.js";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || process.env.AZ_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZ_OPENAI_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZ_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";

export const callFoundry = async (message, conversationId = null) => {
    if (!endpoint || !apiKey || !deployment) {
        throw new Error("Azure OpenAI is not properly configured for Foundry service.");
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const history = conversationId ? getConversation(conversationId) : [];

    const messages = [
        {
            role: "system",
            content:
                "Eres un asistente experto en software, arquitectura, diagramas, análisis técnico y buenas prácticas. Responde siempre de forma clara, profesional y estructurada."
        },
        ...history,
        { role: "user", content: message }
    ];

    try {
        logger.info(`Llamando a Azure OpenAI con mensaje: ${message}`);

        const response = await axios.post(
            url,
            { messages },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": apiKey
                },
                timeout: 60000
            }
        );

        logger.info("Respuesta recibida correctamente de Azure OpenAI");

        return response.data;
    } catch (error) {
        logger.error(
            `Error en Azure OpenAI: ${JSON.stringify(error.response?.data || error.message)}`
        );

        throw new Error("Error al comunicarse con Azure OpenAI");
    }
};

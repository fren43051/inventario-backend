import axios from "axios";
import dotenv from "dotenv";
import { getHistory } from "./conversation.service.js";
import { logger } from "../utils/logger.js";

dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

export const callFoundry = async (message) => {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const messages = [
        {
            role: "system",
            content:
                "Eres un asistente experto en software, arquitectura, diagramas, análisis técnico y buenas prácticas. Responde siempre de forma clara, profesional y estructurada."
        },
        ...getHistory(),
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
                }
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
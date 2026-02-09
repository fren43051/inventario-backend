import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZ_OPENAI_ENDPOINT;
const apiKey = process.env.AZ_OPENAI_KEY;
const deployment = process.env.AZ_OPENAI_DEPLOYMENT || "gpt-4.1";
const apiVersion = "2025-01-01-preview";

if (!endpoint || !apiKey) {
  throw new Error("Faltan variables de entorno AZ_OPENAI_ENDPOINT o AZ_OPENAI_KEY");
}

export async function callAzureChatCompletion(messages, options = {}) {
  try {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const body = {
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 2000
    };

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      }
    });

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("Azure OpenAI Error:", error.response?.data || error.message);
    throw new Error("Error comunicándose con Azure OpenAI");
  }
}

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZ_OPENAI_ENDPOINT;
const apiKey = process.env.AZ_OPENAI_KEY;
const deployment = process.env.AZ_OPENAI_DEPLOYMENT || "gpt-4.1";
const apiVersion = "2025-01-01-preview";

export async function callAzureChatCompletion(messages, options = {}) {
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const body = {
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.max_tokens ?? 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  const response = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey
    }
  });

  return response.data.choices[0].message.content;
}

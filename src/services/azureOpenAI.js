import axios from "axios";

const endpoint = process.env.AZ_OPENAI_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZ_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZ_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";

if (!endpoint || !apiKey) {
  throw new Error("Missing required env vars: AZ_OPENAI_ENDPOINT (or AZURE_OPENAI_ENDPOINT) and AZ_OPENAI_KEY (or AZURE_OPENAI_API_KEY) must be set.");
}

if (!deployment) {
    throw new Error("Missing required env var: AZ_OPENAI_DEPLOYMENT or AZURE_OPENAI_DEPLOYMENT must be set.");
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
      },
      timeout: options.timeout ?? 60000 // 60 seconds timeout as suggested
    });

    const content = response.data?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
        throw new Error(`Azure OpenAI returned an unexpected response structure (status ${response.status}): ${JSON.stringify(response.data)}`);
    }

    return content;

  } catch (error) {
    console.error("Azure OpenAI Error:", error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
        throw new Error("Azure OpenAI request timed out.");
    }
    throw new Error(`Error comunicándose con Azure OpenAI: ${error.message}`);
  }
}

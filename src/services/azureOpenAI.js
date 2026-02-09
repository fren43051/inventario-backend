import axios from "axios";

const endpoint = process.env.AZ_OPENAI_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZ_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZ_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";

// Validation
if (!endpoint) {
    throw new Error("Azure OpenAI endpoint is not configured. Set AZURE_OPENAI_ENDPOINT or AZ_OPENAI_ENDPOINT.");
}
if (!apiKey) {
    throw new Error("Azure OpenAI API key is not configured. Set AZURE_OPENAI_API_KEY or AZ_OPENAI_KEY.");
}
if (!deployment) {
    throw new Error("Azure OpenAI deployment name is not configured. Set AZ_OPENAI_DEPLOYMENT or AZURE_OPENAI_DEPLOYMENT.");
}

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

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      timeout: options.timeout ?? 60000 // Default 60 seconds
    });

    const content = response.data?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
        throw new Error(`Azure OpenAI response missing content (status ${response.status}): ${JSON.stringify(response.data)}`);
    }

    return content;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
        throw new Error("Azure OpenAI request timed out.");
    }
    throw error;
  }
}

import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_DOCUMENT_ENDPOINT;
const apiKey = process.env.AZURE_DOCUMENT_API_KEY;

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

export const analyzeFile = async (buffer) => {
    const poller = await client.beginAnalyzeDocument("prebuilt-read", buffer);
    const result = await poller.pollUntilDone();

    let extractedText = "";

    for (const page of result.pages || []) {
        for (const line of page.lines || []) {
            extractedText += line.content + "\n";
        }
    }

    return extractedText.trim();
};
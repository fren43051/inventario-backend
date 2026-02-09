import { Router } from "express";
import multer from "multer";
import axios from "axios";

const router = Router();
const upload = multer();

const endpoint = process.env.DOC_INTEL_ENDPOINT?.replace(/\/$/, "");
const apiKey = process.env.DOC_INTEL_KEY;

router.get("/result", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "Se requiere el parámetro 'url'." });
        }

        const response = await axios.get(url, {
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error obteniendo resultado:", error.response?.data || error.message);
        res.status(500).json({ error: "Error obteniendo resultado." });
    }
});

router.post("/analyze", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se envió ningún archivo." });
        }

        // 1. POST para iniciar análisis
        const postUrl = `${endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=2023-07-31`;

        const postResponse = await axios.post(postUrl, req.file.buffer, {
            headers: {
                "Content-Type": req.file.mimetype,
                "Ocp-Apim-Subscription-Key": apiKey
            }
        });

        const operationLocation = postResponse.headers["operation-location"];
        if (!operationLocation) {
            return res.status(500).json({ error: "Azure no devolvió Operation-Location." });
        }

        // 2. GET para obtener resultado (usar directamente operation-location)
        const getUrl = operationLocation;

        // Azure tarda un poco → hacemos polling
        let result;
        for (let i = 0; i < 10; i++) {
            const getResponse = await axios.get(getUrl, {
                headers: {
                    "Ocp-Apim-Subscription-Key": apiKey
                }
            });

            if (getResponse.data.status === "succeeded") {
                result = getResponse.data;
                break;
            }

            await new Promise(r => setTimeout(r, 500)); // esperar 0.5s
        }

        if (!result) {
            return res.status(500).json({ error: "Azure no completó el análisis a tiempo." });
        }

        res.json({
            success: true,
            operationLocation,
            data: result
        });

    } catch (error) {
        console.error("Error analizando documento:", error.response?.data || error.message);
        res.status(500).json({ error: "Error analizando documento." });
    }
});

router.post("/ask", async (req, res) => {
    try {
        const { question, documentContent } = req.body;
        
        if (!question || !documentContent) {
            return res.status(400).json({ error: "Se requiere 'question' y 'documentContent'." });
        }

        const openaiEndpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
        const openaiKey = process.env.AZURE_OPENAI_API_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT;
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

        const response = await axios.post(
            `${openaiEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
            {
                messages: [
                    { role: "system", content: "Eres un asistente que responde preguntas sobre documentos." },
                    { role: "user", content: `Documento:\n${documentContent}\n\nPregunta: ${question}` }
                ],
                max_tokens: 800,
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": openaiKey
                }
            }
        );

        res.json({
            success: true,
            answer: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error("Error consultando OpenAI:", error.response?.data || error.message);
        res.status(500).json({ error: "Error consultando el modelo." });
    }
});

export default router;
import { analyzeFile } from "../services/file.service.js";
import { addMessage } from "../services/conversation.service.js";
import { callFoundry } from "../services/foundry.service.js";

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: "No se envió ningún archivo."
            });
        }

        const extractedText = await analyzeFile(file.buffer);

        addMessage("user", `Contenido del archivo:\n${extractedText}`);

        const response = await callFoundry(`Analiza este contenido:\n${extractedText}`);

        const assistantMessage =
            response?.choices?.[0]?.message?.content || "No pude analizar el archivo.";

        addMessage("assistant", assistantMessage);

        res.json({
            success: true,
            extractedText,
            response: assistantMessage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error al procesar el archivo."
        });
    }
};
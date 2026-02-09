import { analyzeFile } from "../services/file.service.js";
import { getConversation, saveConversation } from "../services/conversation.service.js";
import { callFoundry } from "../services/foundry.service.js";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        let conversationId = req.body.conversation_id;

        if (!conversationId) {
            conversationId = uuidv4();
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                error: "No se envió ningún archivo."
            });
        }

        const extractedText = await analyzeFile(file.buffer);
        const userMsg = `Contenido del archivo:\n${extractedText}`;

        const response = await callFoundry(`Analiza este contenido:\n${extractedText}`, conversationId);

        const assistantMessage =
            response?.choices?.[0]?.message?.content || "No pude analizar el archivo.";

        // Update history
        let history = getConversation(conversationId);
        history.push({ role: "user", content: userMsg });
        history.push({ role: "assistant", content: assistantMessage });
        saveConversation(conversationId, history);

        res.json({
            success: true,
            conversation_id: conversationId,
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

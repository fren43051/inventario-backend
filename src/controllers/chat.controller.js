import { callFoundry } from "../services/foundry.service.js";
import { getConversation, saveConversation } from "../services/conversation.service.js";
import { logger } from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        let conversationId = req.body.conversation_id;

        if (!conversationId) {
            conversationId = uuidv4();
        }

        logger.info(`Mensaje recibido del usuario (${conversationId}): ${message}`);

        let history = getConversation(conversationId);

        const response = await callFoundry(message, conversationId);

        const assistantMessage =
            response?.choices?.[0]?.message?.content || "No pude generar respuesta.";

        // Update history
        history.push({ role: "user", content: message });
        history.push({ role: "assistant", content: assistantMessage });
        saveConversation(conversationId, history);

        res.json({
            success: true,
            conversation_id: conversationId,
            response: assistantMessage
        });
    } catch (error) {
        logger.error(`Error en controlador: ${error.message}`);

        res.status(500).json({
            success: false,
            error: "Hubo un problema al procesar tu solicitud. Intenta nuevamente."
        });
    }
};

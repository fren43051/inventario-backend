import { callFoundry } from "../services/foundry.service.js";
import { addMessage } from "../services/conversation.service.js";
import { logger } from "../utils/logger.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        logger.info(`Mensaje recibido del usuario: ${message}`);

        addMessage("user", message);

        const response = await callFoundry(message);

        const assistantMessage =
            response?.choices?.[0]?.message?.content || "No pude generar respuesta.";

        addMessage("assistant", assistantMessage);

        res.json({
            success: true,
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
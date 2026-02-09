import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { clearConversation } from "../services/conversation.service.js";

const router = Router();

// Ruta principal del chatbot
router.post("/", sendMessage);

// Ruta para limpiar el historial de conversación
router.post("/reset", (req, res) => {
    const { conversation_id } = req.body;

    if (conversation_id) {
        clearConversation(conversation_id);
    }

    res.json({
        success: true,
        message: conversation_id ? `Historial ${conversation_id} limpiado.` : "No se proporcionó conversation_id."
    });
});

export default router;

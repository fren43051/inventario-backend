import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { clearHistory } from "../services/conversation.service.js";

const router = Router();

// Ruta principal del chatbot
router.post("/", sendMessage);

// Ruta para limpiar el historial de conversación
router.post("/reset", (req, res) => {
    clearHistory();
    res.json({
        success: true,
        message: "Historial limpiado."
    });
});

export default router;
import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { ocrMiddleware } from "../middleware/ocr.middleware.js";
import { chatWithFile } from "../controllers/chat-with-file.controller.js";

const router = Router();

// Ruta para procesar un archivo y chatear con su contenido
router.post("/", upload.single("file"), ocrMiddleware, chatWithFile);

export default router;

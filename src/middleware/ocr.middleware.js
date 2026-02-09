import { analyzeFile } from "../services/file.service.js";

export const ocrMiddleware = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No se envió ningún archivo para procesar."
            });
        }

        const extractedText = await analyzeFile(req.file.buffer);
        req.extractedText = extractedText;
        next();
    } catch (error) {
        console.error("Error en OCR Middleware:", error.message);
        res.status(500).json({
            success: false,
            error: "Error al extraer texto del documento."
        });
    }
};

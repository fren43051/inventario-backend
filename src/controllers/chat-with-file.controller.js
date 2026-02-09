import { callAzureChatCompletion } from "../services/azureOpenAI.js";

export async function chatWithFile(req, res) {
  try {
    const extractedText = req.extractedText; // Viene del OCR middleware
    const userQuestion = req.body.message || "Analiza el documento.";

    const messages = [
      {
        role: "system",
        content: "Eres un experto analizando documentos técnicos. Responde con precisión."
      },
      {
        role: "user",
        content: `Texto del documento:\n\n${extractedText}`
      },
      {
        role: "user",
        content: userQuestion
      }
    ];

    const assistantReply = await callAzureChatCompletion(messages);

    res.json({
      success: true,
      response: assistantReply
    });

  } catch (error) {
    console.error("Error en chatWithFile:", error.response?.data || error.message);
    res.status(500).json({
        success: false,
        error: "Error procesando el documento con el asistente."
    });
  }
}

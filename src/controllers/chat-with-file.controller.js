import { callAzureChatCompletion } from "../services/azureOpenAI.js";

export async function chatWithFile(req, res) {
  try {
    let extractedText = req.extractedText; // Viene del OCR middleware
    const userQuestion = req.body.message || "Analiza el documento.";

    // Truncate text if it's too long to avoid token limits (rough estimate)
    const MAX_TEXT_LENGTH = 50000;
    if (extractedText && extractedText.length > MAX_TEXT_LENGTH) {
        console.warn(`Document text truncated from ${extractedText.length} to ${MAX_TEXT_LENGTH} chars`);
        extractedText = extractedText.substring(0, MAX_TEXT_LENGTH) + "... [Truncado por límite de tamaño]";
    }

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
        error: error.message || "Error procesando el documento con el asistente."
    });
  }
}

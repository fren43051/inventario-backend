import { callAzureChatCompletion } from "../services/azureOpenAI.js";
import { getConversation, saveConversation } from "../services/conversation.service.js";
import { v4 as uuidv4 } from "uuid";

export async function chatWithFile(req, res) {
  try {
    const extractedText = req.extractedText;
    const userQuestion = req.body.message || "Analiza el documento.";

    let conversationId = req.body.conversation_id;

    if (!conversationId) {
      conversationId = uuidv4();
    }

    let history = getConversation(conversationId);

    if (history.length === 0) {
      history.push({
        role: "system",
        content: "Eres un experto analizando documentos técnicos. Responde con precisión."
      });
    }

    history.push({
      role: "user",
      content: `Texto del documento:\n\n${extractedText}`
    });

    history.push({
      role: "user",
      content: userQuestion
    });

    const assistantReply = await callAzureChatCompletion(history);

    history.push({
      role: "assistant",
      content: assistantReply
    });

    saveConversation(conversationId, history);

    res.json({
      success: true,
      conversation_id: conversationId,
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

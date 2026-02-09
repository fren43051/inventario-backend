const conversations = new Map();

export const getConversation = (conversationId) => {
    return conversations.get(conversationId) || [];
};

export const saveConversation = (conversationId, messages) => {
    conversations.set(conversationId, messages);
};

export const clearConversation = (conversationId) => {
    conversations.delete(conversationId);
};

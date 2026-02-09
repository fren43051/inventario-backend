let history = [];

export const addMessage = (role, content) => {
    history.push({ role, content });
};

export const getHistory = () => {
    return history;
};

export const clearHistory = () => {
    history = [];
};
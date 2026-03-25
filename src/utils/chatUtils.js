const STORAGE_KEY = "agri_chats";
const THEME_KEY = "agri_chat_theme";

export const generateId = () => {
    return "id-" + Math.random().toString(36).substr(2, 9);
};

// ----- CHAT CREATION -----
export const createNewChat = () => ({
    id: generateId(),
    title: "New Chat",
    messages: [
        { sender: "bot", text: "Hello 👋 I am Agri Assistant.\nI help farmers with crops, irrigation, fertilizers, diseases, and weather advice 🌱", suggestions: [] }
    ],
    created: Date.now()
});

// ----- LOAD CHATS -----
export const loadChats = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// ----- SAVE CHATS -----
export const saveChats = (chats) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {
        return[];
    }
};

// ----- DELETE CHAT -----
export const deleteChat = (chats, chatId) => {
    return chats.filter(c => c.id !== chatId);
};

// ----- DARK MODE -----
export const loadTheme = () => {
    return localStorage.getItem(THEME_KEY) || "light";
};

export const saveTheme = (mode) => {
    localStorage.setItem(THEME_KEY, mode);
};

export const saveActiveChat = (id) => {
    localStorage.setItem("activeChatId", id);
};

export const loadActiveChat = () => {
    return localStorage.getItem("activeChatId");
};


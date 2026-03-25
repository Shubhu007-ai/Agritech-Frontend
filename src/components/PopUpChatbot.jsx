import React, { useState, useRef, useEffect } from "react";
import "../styles/PopUpChatbot.css";
import StartVoiceInput from "../assets/StartVoiceInput";

import {
    createNewChat,
    loadChats,
    saveChats,
    deleteChat,
    loadActiveChat,
    saveActiveChat
} from "../utils/chatUtils";

const PopupChatbot = ({ onClose }) => {
    const [inputValue, setInputValue] = useState("");
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [language, setLanguage] = useState("en"); // NEW
    const [showLangMenu, setShowLangMenu] = useState(false); // NEW (fullscreen dropdown)


    const messagesEndRef = useRef(null);
    const controllerRef = useRef(null);
    const recognitionRef = useRef(null);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);

    const activeChat = chats.find(c => c.id === activeChatId);

    /* Load chats on mount — with active chat memory */
    useEffect(() => {
        const stored = loadChats();
        const savedActiveId = loadActiveChat();

        if (stored.length === 0) {
            const fresh = createNewChat();
            setChats([fresh]);
            setActiveChatId(fresh.id);
            saveChats([fresh]);
            saveActiveChat(fresh.id);
            return;
        }

        setChats(stored);

        // If saved chat exists use it, else fallback to first chat
        if (savedActiveId && stored.find(c => c.id === savedActiveId)) {
            setActiveChatId(savedActiveId);
        } else {
            setActiveChatId(stored[0].id);
            saveActiveChat(stored[0].id);
        }
    }, []);


    /* Auto scroll */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat, isTyping]);

    /* Wave animation engine */
    useEffect(() => {
        let animationId;

        if (isListening && analyserRef.current) {
            const animate = () => {
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                const dots = document.querySelectorAll(".wave-dot");

                dots.forEach((dot, i) => {
                    const v = dataArrayRef.current[i] || 0;
                    const height = Math.max(4, (v / 255) * 22);
                    dot.style.height = `${height}px`;
                });

                animationId = requestAnimationFrame(animate);
            };

            animate();
        }

        return () => cancelAnimationFrame(animationId);
    }, [isListening]);

    // Auto title generator (first user message → short title)
    const generateTitle = (text) => {
        if (!text) return "New Chat";

        let cleaned = text.trim().replace(/\s+/g, " ");
        if (cleaned.length > 15) cleaned = cleaned.slice(0, 15) + "…";
        return cleaned;
    };


    // NEW
    const toggleLanguage = () => {
        // Popup mode changes immediately
        if (!isFullScreen) {
            const newLang = language === "en" ? "hi" : "en";
            setLanguage(newLang);
            setInputValue(""); // clear input
            return;
        }

        // Fullscreen mode opens menu instead
        setShowLangMenu(prev => !prev);
    };

    // NEW
    const handleSelectLanguage = (lang) => {
        setLanguage(lang);
        setShowLangMenu(false);
        setInputValue("");
    };



    /* Send message */
    const handleSend = async (textArg = null) => {
        if (isTyping) return;

        const text = textArg || inputValue.trim();
        if (!text) return;

        setInputValue("");
        setIsTyping(true);

        let updatedChat = {
            ...activeChat,
            messages: [...activeChat.messages, { sender: "user", text }]
        };
        if (!updatedChat.title || updatedChat.title === "New Chat") {
            updatedChat.title = generateTitle(text);
        }


        applyUpdate(updatedChat);

        const result = await callChatAPI(text);

        updatedChat = {
            ...updatedChat,
            messages: [
                ...updatedChat.messages,
                { sender: "bot", text: result.reply, suggestions: result.suggestions }
            ]
        };

        setIsTyping(false);
        applyUpdate(updatedChat);
    };

    /* API */
    const callChatAPI = async (userText) => {
        controllerRef.current = new AbortController();
        try {
            const res = await fetch(import.meta.env.VITE_CHAT_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText, lang: language }),

                signal: controllerRef.current.signal
            });
            const data = await res.json();
            return { reply: data.reply, suggestions: data.suggestions || [] };
        } catch {
            return { reply: "Connection error.", suggestions: [] };
        }
    };

    const applyUpdate = (updated) => {
        const newList = chats.map(c => c.id === updated.id ? updated : c);
        setChats(newList);
        saveChats(newList);
    };

    /* Stop response */
    const stopResponse = () => {
        if (controllerRef.current) controllerRef.current.abort();
        setIsTyping(false);
    };

    /* Voice Input Logic */
    const startVoice = async () => {
        try {
            // If already listening -> stop
            if (isListening && recognitionRef.current) {
                recognitionRef.current.stop();
                setIsListening(false);
                return;
            }

            setIsListening(true);

            // Start audio stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current.fftSize = 64;
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

            source.connect(analyserRef.current);

            if (!recognitionRef.current) {
                recognitionRef.current = new window.webkitSpeechRecognition();
                recognitionRef.current.lang = "en-US";
                recognitionRef.current.continuous = false;
            }

            const r = recognitionRef.current;
            r.start();

            r.onresult = (e) => {
                setInputValue(e.results[0][0].transcript);
            };

            r.onend = () => {
                setIsListening(false);
                stream.getTracks().forEach(t => t.stop());
            };

        } catch {
            alert("Voice not supported.");
        }
    };

    return (
        <div className="popup-chat-window-wrapper">

            {/* SIDEBAR FULLSCREEN */}
            {isFullScreen && isSidebarOpen && (
                <div className="chat-sidebar">
                    <button className="sidebar-menu-btn" onClick={() => setIsSidebarOpen(false)}>☰</button>

                    <button className="gemini-new-chat-btn" onClick={() => {
                        const fresh = createNewChat();
                        const list = [fresh, ...chats];
                        setChats(list);
                        setActiveChatId(fresh.id);
                        saveActiveChat(fresh.id);
                        saveChats(list);
                    }} disabled={isTyping}>
                        + New chat
                    </button>

                    <div className="chat-sidebar-list">
                        {chats.map(chat => (
                            <div
                                key={chat.id}
                                className={`gemini-sidebar-item ${chat.id === activeChatId ? "active" : ""}`}
                                onClick={() => {
                                    if (!isTyping) {
                                        setActiveChatId(chat.id);
                                        saveActiveChat(chat.id);
                                    }
                                }}

                            >
                                <span className="chat-item-title">{chat.title}</span>
                                <button
                                    className="chat-del-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stops the sidebar from selecting the chat while deleting

                                        const updated = deleteChat(chats, chat.id);

                                        // If the user deletes the active chat, we must find a new one to show
                                        if (chat.id === activeChatId) {
                                            if (updated.length > 0) {
                                                setActiveChatId(updated[0].id);
                                                saveActiveChat(updated[0].id);
                                            } else {
                                                // If they deleted everything, create a fresh one immediately
                                                const fresh = createNewChat();
                                                const newList = [fresh];
                                                setChats(newList);
                                                setActiveChatId(fresh.id);
                                                saveChats(newList);
                                                return; // Exit early as we've already set state
                                            }
                                        }

                                        setChats(updated);
                                        saveChats(updated);
                                    }}  >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MAIN WINDOW */}
            <div className={`popup-chat-window ${isFullScreen ? "fullscreen" : ""} ${!isSidebarOpen ? "sidebar-closed" : ""}`}>
                <div className="popup-chat-header">
                    {isFullScreen && !isSidebarOpen && (
                        <button className="header-menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
                    )}

                    <button className="popup-new-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
                        {isFullScreen ? "🗗" : "⛶"}
                    </button>


                    <span className="popup-header-title">Agritech Assistant</span>


                    {/* NEW LANGUAGE ICON – FULLSCREEN LEFT OF CLOSE BUTTON */}
                    <button className="popup-new-btn lang-btn" onClick={toggleLanguage}>
                        🌐
                    </button>

                    {/* LANGUAGE DROPDOWN ONLY IN FULLSCREEN */}
                    {isFullScreen && showLangMenu && (
                        <div className="lang-dropdown">
                            <div onClick={() => handleSelectLanguage("en")}>English</div>
                            <div onClick={() => handleSelectLanguage("hi")}>Hindi</div>
                        </div>
                    )}
                    <button className="popup-new-btn close-chat-btn" onClick={onClose}>✕</button>
                </div>

                {/* MESSAGES */}
                <div className="popup-chat-messages">
                    {activeChat?.messages.map((msg, i) => (
                        <div key={i} className={`popup-msg ${msg.sender}`}>
                            {msg.text}
                            {msg.sender === "bot" && msg.suggestions?.length > 0 && (
                                <div className="popup-suggestion-container">
                                    {msg.suggestions.map((s, idx) => (
                                        <button key={idx} className="popup-suggestion-chip" onClick={() => handleSend(s)}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="popup-msg bot typing">
                            <div className="dots"><span></span><span></span><span></span></div>
                        </div>
                    )}

                    <div ref={messagesEndRef}></div>
                </div>

                {/* INPUT */}
                <div className={`popup-chat-input-area ${isListening ? "listening" : ""}`}>
                    <div className="input-wrapper">
                        <input
                            value={isListening ? inputValue : inputValue}
                            onChange={(e) => !isListening && setInputValue(e.target.value)}
                            placeholder={
                                isListening && inputValue.length === 0
                                    ? ""
                                    : isTyping
                                        ? "Thinking..."
                                        : language === "en"
                                            ? "Ask something..."
                                            : "कुछ पूछिए..."
                            }
                            onKeyDown={(e) => !isListening && e.key === "Enter" && handleSend()}
                            disabled={isTyping}
                        />

                        {/* Wave ONLY when mic ON and input empty */}
                        {isListening && inputValue.length === 0 && (
                            <div className="modern-wave">
                                {[...Array(12)].map((_, i) => (
                                    <span key={i} className="wave-dot" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="input-actions">
                        <button className={`popup-voice-btn ${isListening ? "listening" : ""}`} onClick={startVoice} disabled={isTyping}>
                            <StartVoiceInput />
                        </button>

                        {!isTyping ? (
                            <button
                                className="popup-send-btn"
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                            >
                                ➤
                            </button>
                        ) : (
                            <button className="popup-stop-btn" onClick={stopResponse}>
                                ■
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupChatbot;

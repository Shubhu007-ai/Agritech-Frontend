import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  
import PopupChatbot from "./PopUpChatbot";
import "../styles/PopUpChatbot.css";
import ChatbotIcon from "../assets/ChatbotIcon.jsx";

const FloatingChatWidget = () => {

    // Load popup state from localStorage, default false
    const [open, setOpen] = useState(() => {
        return JSON.parse(localStorage.getItem("chatbot_open")) || false;
    });

    const location = useLocation();             
    const hideOnRoutes = ['/login', '/signup', '/chatbot'];
    
    const isLoggedIn = !!localStorage.getItem("token");

    // Save popup state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("chatbot_open", JSON.stringify(open));
    }, [open]);

    if (!isLoggedIn || hideOnRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <>
            {/* Floating Button */}
            <div
                className="floating-chat-btn"
                onClick={() => setOpen(prev => !prev)}
            >
                <ChatbotIcon/>
            </div>

            {/* Chat Window */}
            {open && (
                <div className="popup-chat-container">
                    <PopupChatbot 
                        onClose={() => setOpen(false)} 
                    />
                </div>
            )}
        </>
    );
};

export default FloatingChatWidget;

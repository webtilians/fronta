import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Chat.css"; // Personalízalo a tu gusto

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
     const url = "https://backa-4rgr.onrender.com";
    socketRef.current = io(url, {
    transports: ["websocket"],
    secure: true
  });

    // Escuchar mensajes del bot
    socketRef.current.on("bot-message", (text) => {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll automático al nuevo mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    // Emitir mensaje al backend
    socketRef.current.emit("user_message", text);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Aselvia</div>
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`message ${m.sender === "user" ? "user" : "bot"}`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          autoFocus
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;

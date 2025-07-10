import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [toolInUse, setToolInUse] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const url = "https://backa-4rgr.onrender.com"; // O el tuyo
    socketRef.current = io(url, {
      transports: ["websocket"],
      secure: true
    });

    // Mensaje del bot normal
    socketRef.current.on("bot-message", (text) => {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
    });

    // Evento para mostrar tool en uso
    socketRef.current.on("tool-used", (data) => {
      // data: {tool: "consultar_disponibilidad", input: {...}} o {tool: null}
      if (data.tool) {
        setToolInUse(data.tool);
        setMessages((prev) => [
          ...prev,
          {
            sender: "tool",
            text: `🛠️ Usando la herramienta: ${toolLabel(data.tool)}...`
          }
        ]);
      } else {
        // Borra el aviso del tool anterior
        setToolInUse(null);
        setMessages((prev) => prev.filter((msg) => msg.sender !== "tool"));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll automático al nuevo mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Opcional: "bonito" para nombres de herramientas
  const toolLabel = (tool) => {
    switch (tool) {
      case "consultar_disponibilidad":
        return "Consultar disponibilidad";
      case "crear_reserva":
        return "Crear reserva";
      case "listar_tipos_habitaciones":
        return "Listar tipos de habitaciones";
      case "listar_reservas":
        return "Listar reservas";
      default:
        return tool;
    }
  };

  // Al enviar mensaje
  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const historial = messages.map((m) => ({
      sender: m.sender,
      text: m.text
    })).filter(m => m.sender === "user" || m.sender === "bot");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    // Emitir mensaje y historial (solo user/bot)
    socketRef.current.emit("user_message", { mensaje: text, historial });
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`message ${m.sender === "user" ? "user" : m.sender === "tool" ? "bot tool-used" : "bot"}`}
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

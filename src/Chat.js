import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const url = "https://backa-production.up.railway.app"; 
    socketRef.current = io(url);

    socketRef.current.on('bot-message', (text) => {
      setMessages((prev) => [...prev, { sender: 'aselvia', text }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll automático al final de los mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    console.log('Enviando al backend:', text);
    socketRef.current.emit('user-message', text);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Aselvia</div>
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.sender === 'user' ? 'user' : 'bot'}`}>
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

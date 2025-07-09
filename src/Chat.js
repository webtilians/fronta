import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const url = process.env.REACT_APP_SOCKET_URL;
    socketRef.current = io(url);

    socketRef.current.on('bot-message', (text) => {
      setMessages((prev) => [...prev, { sender: 'aselvia', text }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    socketRef.current.emit('user-message', text);
    setInput('');
  };

  return (
    <div className="chat-container">
      <h2>Aselvia</h2>
      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={m.sender === 'user' ? 'message user' : 'message bot'}>
            {m.text}
          </div>
        ))}
      </div>
      <form className="input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;

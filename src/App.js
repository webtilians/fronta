import React from "react";
import "./App.css";
import Chat from "./Chat";

function App() {
  return (
    <div className="app-bg">
      <div className="header-container">
        <img src="/aselvia-logo.png" alt="Logo Aselvia" className="aselvia-logo" />
        <h1 className="hotel-title">Asistente Hotel </h1>
        <span className="by-aselvia">por AselvIA</span>
      </div>
      <div className="chat-section">
        <Chat />
      </div>
    </div>
  );
}

export default App;

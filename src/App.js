import React from "react";
import "./App.css";
import Chat from "./Chat";

function App() {
  return (
    <div className="app-bg">
      <header className="header-container">
        <img src="/logo.png" alt="Logo Aselvia" className="aselvia-logo" />
      </header>
      <main className="chat-section">
        <Chat />
      </main>
    </div>
  );
}

export default App;

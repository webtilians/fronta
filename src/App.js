import React from 'react';
import Chat from './Chat';
import logo from './aselvia-logo.png';
function App() {
  return (
    <div className="app-root">
      <header className="main-header">
        <img src={logo} alt="Aselvia logo" className="logo" />
        <h1>Asistente Hotel "El Amanecer"</h1>
        <p className="subtitle">por AselvIA</p>
      </header>
      <main className="main-content">
        <Chat />
      </main>
    </div>
  );
}

export default App;

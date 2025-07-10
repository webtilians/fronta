import React from 'react';
import Chat from './Chat';
import logo from './aselvia-logo.png';
function App() {
  return (
    <div className="main-bg">
  <header className="aselvia-header">
    <img src={logo} className="aselvia-logo" alt="Aselvia logo" />
    <div className="aselvia-title">Asistente Hotel "El Amanecer"</div>
    <div className="aselvia-subtitle">por AselvIA</div>
  </header>
  <Chat />
</div>
  );
}

export default App;

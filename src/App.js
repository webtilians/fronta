import React from 'react';
import Chat from './Chat';
import logo from './aselvia-logo.png';
function App() {
  return (
    <>
      <div className="top-header">
        <img src={logo} alt="AselvIA logo" className="top-header-logo" />
        <div className="top-header-title-box">
          <span className="top-header-title">Asistente Hotel "El Amanecer"</span>
          <span className="top-header-subtitle">por AselvIA</span>
        </div>
      </div>
      <div className="info-banner">
        ¡Hola! Soy Aselvia, tu asistente virtual. Selecciona "Hotel" o "Camping" y pregunta lo que necesites. Usa el micrófono o el teclado. Activa "Modo Gerente" si eres staff.
      </div>
      <Chat />
    </>
  );
}

export default App;

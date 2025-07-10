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
      
      <Chat />
    </>
  );
}

export default App;

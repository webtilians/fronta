import React, { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState("");

  // src/App.js
useEffect(() => {
  fetch(process.env.REACT_APP_API_URL)
    .then(res => res.json())
    .then(data => setMsg(data.message));
}, []);


  return (
    <div>
      <h1>{msg || "Cargando..."}</h1>
    </div>
  );
}

export default App;

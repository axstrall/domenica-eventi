import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPage } from './pages/AdminPage'; // AGGIUNTO: Import della pagina admin

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen"
        style={{
          /* Colore di base per nascondere i tagli dello sfondo */
          backgroundColor: "#e0f2f1", 
          backgroundImage: "url('/fiori.webp')", 
          /* Configurazione sfondo ottimizzata */
          backgroundRepeat: "repeat",
          backgroundSize: "550px", 
          backgroundAttachment: "fixed",
          backgroundPosition: "top left"
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          {/* AGGIUNTO: Percorso per la tua rubrica WhatsApp */}
          <Route path="/admin" element={<AdminPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
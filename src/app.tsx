import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';

function App() {
  return (
    <Router>
      <div 
        className="min-h-screen"
        style={{
          backgroundImage: "url('/fiori.webp')", 
          backgroundRepeat: "no-repeat",   /* CAMBIATO: non si ripete più a mosaico */
          backgroundSize: "cover",        /* CAMBIATO: copre tutto lo schermo uniformemente */
          backgroundPosition: "center",   /* CAMBIATO: centra l'immagine */
          backgroundAttachment: "fixed"   /* L'immagine resta ferma mentre scorri */
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
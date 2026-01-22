import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';

function App() {
  return (
    <Router>
      {/* Questo div avvolge tutto il sito e applica l'immagine di sfondo */}
      <div 
        className="min-h-screen"
        style={{
          backgroundImage: "url('/bg-pattern.jpg')", // Nome della tua foto in public
          backgroundRepeat: "repeat",               // L'immagine si ripete come una trama
          backgroundSize: "auto",                   // Mantiene la dimensione originale della trama
          backgroundAttachment: "fixed"             // Lo sfondo resta fermo mentre scorri
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
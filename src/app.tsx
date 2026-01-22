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
          /* Colore di base identico allo sfondo dell'immagine per nascondere i tagli */
          backgroundColor: "#e0f2f1", 
          backgroundImage: "url('/fiori.webp')", 
          /* Manteniamo repeat ma regoliamo la grandezza per ridurre l'effetto 'taglio' */
          backgroundRepeat: "repeat",
          backgroundSize: "550px", 
          backgroundAttachment: "fixed",
          backgroundPosition: "top left"
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
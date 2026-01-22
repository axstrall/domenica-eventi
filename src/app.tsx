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
          /* Torniamo al repeat per mantenere la nitidezza originale dei fiori */
          backgroundRepeat: "repeat",
          /* Usiamo una dimensione fissa media per evitare l'effetto "pixelato" */
          backgroundSize: "500px", 
          backgroundAttachment: "fixed",
          /* Aggiungiamo un colore di fondo simile per ammorbidire le giunture */
          backgroundColor: "#e0f2f1" 
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
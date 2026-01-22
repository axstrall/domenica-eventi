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
          backgroundImage: "url('/sfondo-fiori.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "400px", // Regola la grandezza dei fiori qui
          backgroundAttachment: "fixed"
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
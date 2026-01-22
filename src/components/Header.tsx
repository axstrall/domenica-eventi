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
          /* Usiamo il nome esatto del tuo file: fiori.webp */
          backgroundImage: "url('/fiori.webp')", 
          backgroundRepeat: "repeat",
          backgroundSize: "400px", 
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
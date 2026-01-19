import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ScrollToTop } from './components/ScrollToTop'; // Opzionale, vedi sotto

function App() {
  return (
    <Router>
      {/* Questo componente serve per non far restare la pagina a metà quando cambi sezione */}
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Usiamo /catalog perché i tuoi link puntano qui */}
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
    </Router>
  );
}

export default App;
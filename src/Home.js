import React, { useState } from 'react'; // Corregir esta línea
import { Link } from 'react-router-dom';
import logo from './logo.jpg';
import './App.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Buscando:', searchTerm);
  };

  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="nav-buttons">
          <Link to="/nosotros" className="nav-btn">Nosotros</Link>
          <Link to="/login" className="nav-btn">Iniciar Sesión</Link> {/* Cambiar a Link */}
          <Link to="/registro" className="nav-btn register-btn">Registrarse</Link> {/* Cambiar a Link */}
        </nav>
      </header>

      <main className="main-content">
        <h1 className="title">Bienvenido a tu Sistema de Gestión de Tratamientos</h1>
        <div className="search-container">
          <div className="search-wrapper"> {/* Agregar este div contenedor */}
            <input 
              type="text" 
              placeholder="Busca medicamentos, farmacias o tratamientos..." 
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="search-icon-btn" 
              onClick={handleSearch}
              aria-label="Buscar"
            >
              <svg 
                className="search-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
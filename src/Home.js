import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.jpg';
import mascota from './Vita2.png'
import './App.css';
import './ComparadorPrecios.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/comparador-precios', { state: { searchQuery: searchTerm, from: 'home' } });
  };

  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="nav-buttons">
          <Link to="/nosotros" className="nav-btn">Nosotros</Link>
          <Link to="/login" className="nav-btn">Iniciar Sesión</Link>
          <Link to="/registro" className="nav-btn register-btn">Registrarse</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="title">¡Bienvenido a Vitality Hub!</h1>
            <h2 className="subtitle">Tu Sistema Integral de Gestión de Tratamientos</h2>
          </div>
          
        </div>

        <div className="hero-text">
          <p className="tagline">¡Compara precios de medicamentos para tu tratamiento!</p>
          <div className="search-container">
            <div className="search-wrapper">
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
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Gestiona tu tratamiento</h3>
            <p>Alertas personalizadas y recordatorios de horarios para cada medicamento</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Control total</h3>
            <p>Añade tus medicamentos al dashboard para monitorear tu evolución</p>
          </div>

          <img
            src={mascota}
            alt="Mascota de Vitality Hub"
            className="mascota-img"
          />
         <div className="mascota-message">
           <p> ¡Hola! Soy Vita, tu asistente virtual.</p>
           <p>¿Listo para tomar control de tu tratamiento médico?</p>
           <p>¡Explora todas nuestras funciones!</p>
          </div>
        </div>

        <div className="cta-section">
          <p className="cta-text">¿Primera vez aquí?</p>
          <Link to="/registro" className="cta-button">Empieza ahora gratis →</Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
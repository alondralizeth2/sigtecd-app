import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from './logo.jpg';
import './App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función async correctamente declarada
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Correo electrónico inválido');
          break;
        case 'auth/user-not-found':
          setError('Usuario no registrado');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta');
          break;
        default:
          setError('Error al iniciar sesión');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="nav-buttons">
          <Link to="/" className="nav-btn inicio-btn">Inicio</Link>
        </nav>
      </header>

      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <Link to="/recuperar-contraseña" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Ingresar'}
          </button>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
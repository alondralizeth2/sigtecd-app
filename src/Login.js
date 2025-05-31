import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import logo from './logo.jpg';
import './App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificación adicional del usuario
      if (!userCredential.user) {
        throw new Error('No se pudo obtener información del usuario');
      }

      // Navegar al dashboard después de una breve espera
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Error de autenticación:', err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Correo electrónico inválido');
          break;
        case 'auth/user-disabled':
          setError('Cuenta deshabilitada');
          break;
        case 'auth/user-not-found':
          setError('Usuario no registrado');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta');
          break;
        default:
          setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
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
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                Iniciando...
              </div>
            ) : 'Ingresar'}
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
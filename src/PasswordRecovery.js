import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un correo para restablecer tu contraseña');
      setError('');
    } catch (err) {
      setError('Error al enviar el correo: ' + err.message);
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <div className="password-recovery-form">
        <h2>Recuperar Contraseña</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Enviar Instrucciones
          </button>
          
          <p className="back-to-login">
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
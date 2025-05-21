import React, { useEffect } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './App.css';

const VerificacionExitosa = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        navigate('/cuestionario');
      } else {
        navigate('/verificacion-pendiente');
      }
    };
    
    checkVerification();
  }, [navigate]);

  return (
    <div className="verification-container">
      <h2>Verificando tu correo...</h2>
      <p>Por favor espera mientras confirmamos tu verificación.</p>
    </div>
  );
};

export default VerificacionExitosa;
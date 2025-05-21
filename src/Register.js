import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import logo from './logo.jpg';
import './App.css';

const Register = () => {
  const [userData, setUserData] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar coincidencia de contraseñas
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Crear usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Enviar correo de verificación
      await sendEmailVerification(userCredential.user, {
        url: 'http://localhost:3000/verify-email'
      });

      // Guardar datos en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        email: userData.email,
        fechaNacimiento: userData.fechaNacimiento,
        emailVerificado: false,
        fechaRegistro: new Date(),
        uid: userCredential.user.uid
      });

      // Guardar email en localStorage
      localStorage.setItem('emailForVerification', userData.email);

      // Redirigir
      navigate('/verificacion-pendiente');

    } catch (error) {
      let errorMessage = 'Error al registrar: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Formato de correo inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener mínimo 6 caracteres';
          break;
        default:
          errorMessage += error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/" className="home-button">
          Inicio
        </Link>
      </header>

      <div className="form-container">
        <div className="register-box">
          <h2>Crear Cuenta</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={userData.nombres}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="apellidos"
                placeholder="Apellidos"
                value={userData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="date"
                name="fechaNacimiento"
                value={userData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña (mínimo 6 caracteres)"
                value={userData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={userData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registrando...
                </>
              ) : 'Crear Cuenta'}
            </button>
          </form>

          <div className="login-redirect">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
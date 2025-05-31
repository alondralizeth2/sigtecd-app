import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import logo from './logo.jpg';
import './Register.css';

const Register = () => {
  const [userData, setUserData] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: '',
    genero: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validaciones
      if (!userData.nombres || !userData.apellidos || !userData.fechaNacimiento || !userData.email || !userData.password) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Opcional: Enviar verificación por correo (comentar si no se necesita)
      await sendEmailVerification(userCredential.user);

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        nombres: userData.nombres.trim(),
        apellidos: userData.apellidos.trim(),
        email: userData.email.toLowerCase().trim(),
        fechaNacimiento: userData.fechaNacimiento,
        genero: userData.genero,
        terminosAceptados: false,
        cuestionarioCompleto: false,
        fechaRegistro: new Date(),
        ultimaActualizacion: new Date()
      });

      setSuccess(true);
      alert('¡Registro exitoso! Serás redirigido a los términos y condiciones');
      
      setTimeout(() => {
        navigate('/terminos');
      }, 2000);

    } catch (error) {
      console.error('Error en registro:', error);
      let errorMessage = 'Error al registrar: ';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Formato de correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operación no permitida';
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
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
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
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">¡Registro exitoso!</div>}

          <form onSubmit={handleRegister}>
            <div className="input-row">
              <div className="input-group">
                <label>Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  placeholder="Ej: María"
                  value={userData.nombres}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  placeholder="Ej: González"
                  value={userData.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={userData.fechaNacimiento}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="input-group">
                <label>Género</label>
                <select
                  name="genero"
                  value={userData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="Ej: usuario@ejemplo.com"
                value={userData.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>

              <div className="input-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="terms-notice">
              Al registrarte, aceptas nuestros <Link to="/terminos">Términos y Condiciones</Link>
            </div>

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
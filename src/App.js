import React from 'react';
import { auth } from './firebase';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Nosotros from './Nosotros';
import Login from './Login';
import Register from './Register';
import PasswordRecovery from './PasswordRecovery';
import Dashboard from './Dashboard';
import VerificacionPendiente from './VerificacionPendiente';
import VerificacionExitosa from './VerificacionExitosa';
import VerifyEmailLink from './VerifyEmailLink';
import Terminos from './Terminos';
import WelcomeQuestions from './WelcomeQuestions';
import ErrorVerification from './ErrorVerification';

function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/nosotros" element={<Nosotros />} />
  <Route path="/login" element={<Login />} />
  <Route path="/recuperar-contraseña" element={<PasswordRecovery />} />
  <Route path="/registro" element={<Register />} />
  <Route path="/terminos" element={<Terminos />} />
  <Route path="/recuperar-contraseña" element={<PasswordRecovery />} />
  <Route path="/verificacion-pendiente" element={<VerificacionPendiente />} />
  <Route path="/verificacion-exitosa" element={<VerificacionExitosa />} />
  <Route path="/verify-email-link" element={<VerifyEmailLink />} />
  <Route path="/cuestionario" element={<WelcomeQuestions />} />
  <Route path="/error-verificacion" element={<ErrorVerification />} />
  <Route path="/dashboard" element={auth.currentUser ? <Dashboard /> : <Navigate to="/login" />} />
</Routes>
  );
}

export default App;
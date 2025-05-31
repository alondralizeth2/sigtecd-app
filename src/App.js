import React from 'react';
import { auth } from './firebase';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import Home from './Home';
import Nosotros from './Nosotros';
import Login from './Login';
import Register from './Register';
import PasswordRecovery from './PasswordRecovery';
import Dashboard from './Dashboard';
import VerificacionExitosa from './VerificacionExitosa';
import VerifyEmailLink from './VerifyEmailLink';
import Terminos from './Terminos';
import WelcomeQuestions from './WelcomeQuestions';
import ErrorVerification from './ErrorVerification';
import DashboardMock from './DashboardMock';
import ComparadorPrecios from './ComparadorPrecios';

function App() {
  const [user, loading] = useAuthState(auth);

  const RequireAuth = ({ children }) => {
    if (loading) return <div>Cargando...</div>;
    return user ? children : <Navigate to="/login" />;
  };
  
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar-contraseña" element={<PasswordRecovery />} />
    
      {/* Verificación de email */}
      <Route path="/verify-email-link/:oobCode" element={<VerifyEmailLink />} />
      <Route path="/verificacion-exitosa" element={<VerificacionExitosa />} />
      <Route path="/error-verificacion" element={<ErrorVerification />} />

      {/* Autenticadas */}
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/terminos" element={<RequireAuth><Terminos /></RequireAuth>} />
      <Route path="/cuestionario" element={<RequireAuth><WelcomeQuestions /></RequireAuth>} />
      
      {/* Informativas */}
      <Route path="/nosotros" element={<Nosotros />} />

      <Route path="/dashboard" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />
      
      <Route path="/dashboard-mock" element={<DashboardMock />} />
      {/* Informativas */}
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/comparador-precios" element={<ComparadorPrecios />} />
    </Routes>
  );
}

export default App;
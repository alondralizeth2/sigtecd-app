import { Link } from 'react-router-dom';

const VerificacionPendiente = () => {
  return (
    <div className="status-container">
      <h2>Verifica tu correo electrónico</h2>
      <p>Por favor revisa tu correo electrónico para verificar tu cuenta.</p>
      <p>¿No recibiste el correo? <button>Reenviar verificación</button></p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default VerificacionPendiente;
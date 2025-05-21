import { useNavigate, useLocation } from "react-router-dom";
import './App.css';

const ErrorVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error || "Error desconocido";

  return (
    <div className="error-container">
      <h2>Error de verificación</h2>
      <p className="error-message">{errorMessage}</p> {/* Mensaje específico */}
      <button 
        onClick={() => navigate("/registro")}
        className="retry-button"
      >
        Reintentar registro
      </button>
    </div>
  );
};

export default ErrorVerification;
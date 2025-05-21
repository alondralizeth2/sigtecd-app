import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './App.css';

const enfermedadesCronicas = [
  'Diabetes',
  'Hipertensión',
  'Artritis',
  'Cáncer',
  'Enfermedad cardiovascular',
  'EPOC',
  'Otra'
];

const WelcomeQuestions = () => {
  const [formData, setFormData] = useState({
    enfermedad: '',
    otraEnfermedad: '',
    tratamientoActual: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.enfermedad) {
      setError('Selecciona una enfermedad');
      return;
    }

    try {
      await setDoc(doc(db, 'usuarios', auth.currentUser.uid), {
        cuestionario: formData
      }, { merge: true });
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error guardando datos:", error);
      setError('Ocurrió un error al guardar los datos');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="welcome-modal">
        <h2>¡Bienvenido! Completa tu perfil</h2>
        
        <form onSubmit={handleSubmit} className="questionnaire-form">
          <div className="input-group">
            <label>¿Qué enfermedad crónico-degenerativa padece?</label>
            <select
              name="enfermedad"
              value={formData.enfermedad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {enfermedadesCronicas.map((enfermedad) => (
                <option key={enfermedad} value={enfermedad}>{enfermedad}</option>
              ))}
            </select>
            
            {formData.enfermedad === 'Otra' && (
              <input
                type="text"
                name="otraEnfermedad"
                placeholder="Especifique su enfermedad"
                value={formData.otraEnfermedad}
                onChange={handleChange}
                required
                className="additional-input"
              />
            )}
          </div>

          <div className="input-group">
            <label>¿Actualmente sigue un tratamiento médico?</label>
            <select
              name="tratamientoActual"
              value={formData.tratamientoActual}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="auth-button">
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomeQuestions;
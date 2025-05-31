import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './WelcomeQuestions.css';

const enfermedadesCronicas = [
  'Diabetes Tipo 1',
  'Diabetes Tipo 2',
  'Hipertensión',
  'Artritis',
  'Cáncer',
  'Enfermedad cardiovascular',
  'EPOC',
  'Otra'
];

const WelcomeQuestions = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    enfermedad: '',
    otraEnfermedad: '',
    tratamientoActual: '',
    ultimaRevision: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar datos existentes si ya hay información
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists() && userDoc.data().cuestionario) {
          setFormData(userDoc.data().cuestionario);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones
      if (!formData.enfermedad) {
        throw new Error('Selecciona una enfermedad');
      }

      if (formData.enfermedad === 'Otra' && !formData.otraEnfermedad) {
        throw new Error('Especifica tu enfermedad');
      }

      if (!formData.tratamientoActual) {
        throw new Error('Indica si sigues un tratamiento');
      }

      if (!user) throw new Error('Usuario no autenticado');

      await updateDoc(doc(db, 'usuarios', user.uid), {
        cuestionario: {
          enfermedad: formData.enfermedad === 'Otra' ? formData.otraEnfermedad : formData.enfermedad,
          otraEnfermedad: formData.enfermedad === 'Otra' ? '' : formData.otraEnfermedad,
          tratamientoActual: formData.tratamientoActual,
          ultimaRevision: formData.ultimaRevision || null
        },
        cuestionarioCompleto: true,
        ultimaActualizacion: new Date()
      });

      navigate('/dashboard');

    } catch (error) {
      console.error("Error guardando datos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-questions-container">
      <div className="welcome-card">
        <h2>Completa tu perfil médico</h2>
        <p>Esta información nos ayudará a brindarte una mejor experiencia</p>
        
        <form onSubmit={handleSubmit} className="questionnaire-form">
          <div className="input-group">
            <label>¿Qué enfermedad crónica padeces?</label>
            <select
              name="enfermedad"
              value={formData.enfermedad}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              {enfermedadesCronicas.map((enfermedad) => (
                <option key={enfermedad} value={enfermedad}>{enfermedad}</option>
              ))}
            </select>
            
            {formData.enfermedad === 'Otra' && (
              <input
                type="text"
                name="otraEnfermedad"
                placeholder="Describe tu enfermedad"
                value={formData.otraEnfermedad}
                onChange={handleChange}
                required={formData.enfermedad === 'Otra'}
                className="additional-input"
              />
            )}
          </div>

          <div className="input-group">
            <label>¿Actualmente sigues un tratamiento médico?</label>
            <select
              name="tratamientoActual"
              value={formData.tratamientoActual}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="input-group">
            <label>Fecha de tu última revisión médica (opcional)</label>
            <input
              type="date"
              name="ultimaRevision"
              value={formData.ultimaRevision}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Completar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomeQuestions;
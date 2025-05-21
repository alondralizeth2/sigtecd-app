import React, { useState, useEffect } from 'react';
import './App.css';

const Dashboard = () => {
  // Estados
  const [showModal, setShowModal] = useState(false);
  const [medicamentos, setMedicamentos] = useState(
    JSON.parse(localStorage.getItem('medicamentos')) || []
  );
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    nombre: '',
    dosis: '',
    frecuencia: '',
    hora: ''
  });

  // Datos simulados del paciente
  const paciente = {
    nombres: "Fabiola Puentes",
    cuestionario: {
      enfermedad: "Diabetes Tipo 2",
      tratamientoActual: "Sí",
      ultimaRevision: "15/03/2024"
    }
  };

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
  }, [medicamentos]);

  // Sistema de notificaciones
  useEffect(() => {
    const intervalos = medicamentos.map(med => {
      if (med.hora) {
        const ahora = new Date();
        const [horas, minutos] = med.hora.split(':');
        const horaAlarma = new Date();
        
        horaAlarma.setHours(horas, minutos, 0, 0);
        if (horaAlarma < ahora) horaAlarma.setDate(horaAlarma.getDate() + 1);
        
        return setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('Recordatorio de medicamento', {
              body: `${med.nombre} - ${med.dosis}mg\nHora programada: ${med.hora}`
            });
          }
        }, horaAlarma - ahora);
      }
      return null;
    });

    return () => intervalos.forEach(clearTimeout);
  }, [medicamentos]);

  return (
    <div className="dashboard-container">
      
      {/* Header con datos del paciente */}
      <header className="dashboard-header">
        <div className="patient-info">
          <h1>Bienvenida, {paciente.nombres}</h1>
          <div className="patient-status">
            <p>🏥 Enfermedad principal: <strong>{paciente.cuestionario.enfermedad}</strong></p>
            <p>💊 En tratamiento activo: <strong>{paciente.cuestionario.tratamientoActual}</strong></p>
            <p>📅 Última revisión: <strong>{paciente.cuestionario.ultimaRevision}</strong></p>
          </div>
        </div>
        
        <button 
          className="btn-agregar"
          onClick={() => setShowModal(true)}
        >
          ＋ Nuevo Medicamento
        </button>
      </header>

      {/* Sección de medicamentos */}
      <div className="dashboard-section">
        <h2>Tus Medicamentos Activos</h2>
        
        <div className="medicamentos-grid">
          {medicamentos.map((med, index) => (
            <div key={index} className="medicamento-card">
              <div className="med-header">
                <h3>{med.nombre}</h3>
                <span className="dosis-tag">{med.dosis}mg</span>
              </div>
              <div className="med-details">
                <p>⏰ Frecuencia: {med.frecuencia}</p>
                <p>⏰ Hora programada: {med.hora}</p>
              </div>
              <button 
                className="btn-eliminar"
                onClick={() => setMedicamentos(
                  medicamentos.filter((_, i) => i !== index)
                )}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar medicamentos */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Registrar Nuevo Medicamento</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setMedicamentos([...medicamentos, {
                ...nuevoMedicamento,
                id: Date.now()
              }]);
              setNuevoMedicamento({ nombre: '', dosis: '', frecuencia: '', hora: '' });
              setShowModal(false);
            }}>
              <div className="form-group">
                <label>Nombre del medicamento:</label>
                <input
                  type="text"
                  value={nuevoMedicamento.nombre}
                  onChange={(e) => setNuevoMedicamento({
                    ...nuevoMedicamento,
                    nombre: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dosis (mg):</label>
                  <input
                    type="number"
                    value={nuevoMedicamento.dosis}
                    onChange={(e) => setNuevoMedicamento({
                      ...nuevoMedicamento,
                      dosis: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Frecuencia:</label>
                  <select
                    value={nuevoMedicamento.frecuencia}
                    onChange={(e) => setNuevoMedicamento({
                      ...nuevoMedicamento,
                      frecuencia: e.target.value
                    })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Diario">Diario</option>
                    <option value="Cada 12h">Cada 12 horas</option>
                    <option value="Semanal">Semanal</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Hora de la toma:</label>
                <input
                  type="time"
                  value={nuevoMedicamento.hora}
                  onChange={(e) => setNuevoMedicamento({
                    ...nuevoMedicamento,
                    hora: e.target.value
                  })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar Medicamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
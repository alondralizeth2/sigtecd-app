import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { format, addDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import './Dashboard.css';
import logo from './logo.jpg';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [semanaActual] = useState(new Date());
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    nombre: '',
    dosis: '',
    frecuencia: 'Diario',
    hora: '08:00',
    pastillasActuales: '',
    fechaInicio: new Date()
  });
  const navigate = useNavigate();

  // Efecto para cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'usuarios', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
            if (!userSnap.data().cuestionarioCompleto) navigate('/welcome-questions');
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };
    fetchUserData();
  }, [user, navigate]);

  // Efecto para medicamentos
  useEffect(() => {
    if (!user) return;
    const medsRef = collection(db, `usuarios/${user.uid}/medicamentos`);
    const unsubscribe = onSnapshot(medsRef, (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicamentos(meds);
    });
    return () => unsubscribe();
  }, [user]);

  // Actualizar inventario automático
  useEffect(() => {
    const actualizarInventario = async () => {
      const ahora = new Date();
      medicamentos.forEach(async (med) => {
        if (!med.fechaInicio) return;
        
        const dosisPorDia = () => {
          switch(med.frecuencia) {
            case 'Cada 8h': return 3;
            case 'Cada 12h': return 2;
            default: return 1;
          }
        };

        const diasTranscurridos = Math.floor(
          (ahora - med.fechaInicio.toDate()) / (1000 * 3600 * 24)
        );
        
        const consumoTotal = diasTranscurridos * dosisPorDia();
        const nuevasPastillas = Math.max(med.pastillasIniciales - consumoTotal, 0);
        
        if(nuevasPastillas !== med.pastillasActuales) {
          await updateDoc(doc(db, `usuarios/${user.uid}/medicamentos`, med.id), {
            pastillasActuales: nuevasPastillas
          });
        }
      });
    };
    
    const intervalo = setInterval(actualizarInventario, 3600000);
    return () => clearInterval(intervalo);
  }, [medicamentos, user]);

  // Funciones de manejo
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Ocurrió un error al cerrar sesión');
    }
  };

  const agregarMedicamento = async (e) => {
    e.preventDefault();
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const medsRef = collection(db, `usuarios/${user.uid}/medicamentos`);
      await addDoc(medsRef, {
        ...nuevoMedicamento,
        nombre: nuevoMedicamento.nombre.trim(),
        pastillasIniciales: Number(nuevoMedicamento.pastillasActuales),
        fechaInicio: new Date(),
        fechaRegistro: new Date()
      });

      setNuevoMedicamento({
        nombre: '',
        dosis: '',
        frecuencia: 'Diario',
        hora: '08:00',
        pastillasActuales: '',
        fechaInicio: new Date()
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error al agregar medicamento:", error);
      alert(error.message || 'Error al guardar el medicamento');
    }
  };

  const eliminarMedicamento = async (id) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
        await deleteDoc(doc(db, `usuarios/${user.uid}/medicamentos`, id));
      }
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
      alert('Error al eliminar el medicamento');
    }
  };

  // Funciones para calendario
  const generarDiasSemana = () => {
    const inicioSemana = startOfWeek(semanaActual, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: inicioSemana, end: addDays(inicioSemana, 6) });
  };

  const esDiaDeToma = (medicamento, fecha) => {
    if (!medicamento.fechaInicio) return false;
    const diasDesdeInicio = Math.floor(
      (fecha - medicamento.fechaInicio.toDate()) / (1000 * 3600 * 24)
    );
    
    switch(medicamento.frecuencia) {
      case 'Diario': return true;
      case 'Cada 2 días': return diasDesdeInicio % 2 === 0;
      case 'Semanal': return diasDesdeInicio % 7 === 0;
      default: return true;
    }
  };

  if (!userData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando tus datos...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="app-logo" onClick={() => navigate('/')} />
        <div className="user-menu">
          <span className="user-greeting">👤 Hola, {userData.nombres}</span>
          <div className="menu-dropdown">
            <button onClick={() => navigate('/perfil')}>📝 Editar perfil</button>
            <button onClick={handleLogout}>🚪 Cerrar sesión</button>
          </div>
        </div>
      </header>

      <div className="welcome-card-d">
        <div className="health-status">
          <h1>Bienvenid{userData.genero === 'femenino' ? 'a' : 'o'}</h1>
          {userData.cuestionario && (
            <div className="patient-status">
              <p>🏥 Enfermedad principal: <strong>{userData.cuestionario.enfermedad}</strong></p>
              <p>💊 En tratamiento: <strong>{userData.cuestionario.tratamientoActual}</strong></p>
              <p>📅 Última revisión: <strong>{userData.cuestionario.ultimaRevision}</strong></p>
            </div>
          )}
        </div>
        <div className="quick-actions">
          <button className="btn-agregar" onClick={() => setShowModal(true)}>
            ＋ Nuevo Medicamento
          </button>
          <button className="btn-comparar" onClick={() => navigate('/comparador-precios')}>
            💰 Comparar Precios
          </button>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Tus Medicamentos Activos</h2>
        <div className="medicamentos-grid">
          {medicamentos.map((med) => (
            <div key={med.id} className="medicamento-card">
              <div className="card-header">
                <span className="pill-icon">💊</span>
                <h3>{med.nombre}</h3>
              </div>
              <div className="med-details">
                <p><strong>Dosis:</strong> {med.dosis}mg</p>
                <p><strong>Frecuencia:</strong> {med.frecuencia}</p>
                <p><strong>Próxima toma:</strong> {med.hora}</p>
                <p><strong>Pastillas restantes:</strong> {med.pastillasActuales}</p>
                {med.pastillasActuales <= 2 && (
                  <div className="alerta-bajas-existencias">
                    ⚠️ ¡Quedan pocas pastillas!
                    <button onClick={() => navigate('/comparador-precios')}>Comprar más</button>
                  </div>
                )}
              </div>
              <button className="btn-eliminar" onClick={() => eliminarMedicamento(med.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="calendario-semanal">
        <h2>Calendario de Medicamentos</h2>
        <div className="contenedor-dias">
          {generarDiasSemana().map((dia, index) => (
            <div key={index} className="dia-calendario">
              <div className="cabecera-dia">
                {format(dia, 'EEEE', { locale: es })}
              </div>
              <div className="contenido-dia">
                {medicamentos
                  .filter(med => esDiaDeToma(med, dia))
                  .map(med => (
                    <div key={med.id} className="medicamento-calendario">
                      {med.nombre} - {med.hora}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>➕ Registrar Nuevo Medicamento</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={agregarMedicamento} className="medication-form">
              <div className="input-group">
                <input
                  type="text"
                  value={nuevoMedicamento.nombre}
                  onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.target.value })}
                  required
                />
                <label>Nombre del medicamento</label>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <input
                    type="number"
                    value={nuevoMedicamento.dosis}
                    onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, dosis: e.target.value })}
                    required
                    min="1"
                  />
                  <label>Dosis (mg)</label>
                </div>
                <div className="input-group">
                  <select
                    value={nuevoMedicamento.frecuencia}
                    onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, frecuencia: e.target.value })}
                    required
                  >
                    <option value="Diario">Diario</option>
                    <option value="Cada 8h">Cada 8 horas</option>
                    <option value="Cada 12h">Cada 12 horas</option>
                    <option value="Cada 2 días">Cada 2 días</option>
                    <option value="Semanal">Semanal</option>
                  </select>
                  <label>Frecuencia</label>
                </div>
              </div>
              <div className="input-group">
                <input
                  type="time"
                  value={nuevoMedicamento.hora}
                  onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, hora: e.target.value })}
                  required
                />
                <label>Hora de la toma</label>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  value={nuevoMedicamento.pastillasActuales}
                  onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, pastillasActuales: e.target.value })}
                  required
                  min="1"
                />
                <label>Pastillas disponibles</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar
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
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './App.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    nombre: '',
    dosis: '',
    frecuencia: ''
  });
  const navigate = useNavigate();

  // Obtener datos del usuario y sus medicamentos
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        // Datos del usuario
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserData(userSnap.data());

        // Medicamentos del usuario
        const medsRef = collection(db, `usuarios/${auth.currentUser.uid}/medicamentos`);
        const querySnapshot = await getDocs(medsRef);
        setMedicamentos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchData();
  }, []);

  // Añadir nuevo medicamento
  const agregarMedicamento = async (e) => {
    e.preventDefault();
    try {
      const medsRef = collection(db, `usuarios/${auth.currentUser.uid}/medicamentos`);
      await addDoc(medsRef, {
        ...nuevoMedicamento,
        fechaRegistro: serverTimestamp()
      });
      setNuevoMedicamento({ nombre: '', dosis: '', frecuencia: '' });
      // Actualizar lista
      const updatedMeds = await getDocs(medsRef);
      setMedicamentos(updatedMeds.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error añadiendo medicamento:", error);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (!userData) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Bienvenido, {userData.nombres}</h2>
        <nav>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <div className="dashboard-content">
        {/* Formulario para añadir medicamentos */}
        <section className="dashboard-card">
          <h3>Añadir Nuevo Medicamento</h3>
          <form onSubmit={agregarMedicamento}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre del medicamento"
                value={nuevoMedicamento.nombre}
                onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, nombre: e.target.value})}
                required
              />
            </div>
            
            <div className="input-row">
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Dosis (mg)"
                  value={nuevoMedicamento.dosis}
                  onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, dosis: e.target.value})}
                  required
                />
              </div>
              
              <div className="input-group">
                <select
                  value={nuevoMedicamento.frecuencia}
                  onChange={(e) => setNuevoMedicamento({...nuevoMedicamento, frecuencia: e.target.value})}
                  required
                >
                  <option value="">Frecuencia</option>
                  <option value="Diario">Diario</option>
                  <option value="Cada 12 horas">Cada 12 horas</option>
                  <option value="Semanal">Semanal</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="primary-btn">
              Añadir Medicamento
            </button>
          </form>
        </section>

        {/* Lista de medicamentos */}
        <section className="dashboard-card">
          <h3>Tus Medicamentos</h3>
          <div className="medicamentos-list">
            {medicamentos.map(med => (
              <div key={med.id} className="medicamento-item">
                <div className="med-info">
                  <h4>{med.nombre}</h4>
                  <p>{med.dosis}mg - {med.frecuencia}</p>
                </div>
                <button 
                  className="comparar-btn"
                  onClick={() => navigate(`/comparar-costos?med=${encodeURIComponent(med.nombre)}`)}
                >
                  Comparar precios
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Botón de búsqueda general */}
        <section className="dashboard-card">
          <h3>Comparador Avanzado</h3>
          <button
            className="primary-btn"
            onClick={() => navigate('/comparar-costos')}
          >
            Buscar Todos los Medicamentos
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'usuarios', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (!userData) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Bienvenido, {userData.nombres}</h2>
        <nav>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </nav>
      </header>

      {/* Contenido principal */}
      <div className="dashboard-content">
        
        {/* Tarjeta de Resumen Médico */}
        <section className="dashboard-card">
          <h3>Resumen de tu salud</h3>
          <p>Enfermedad principal: {userData.cuestionario?.enfermedad}</p>
          <p>Tratamiento actual: {userData.cuestionario?.tratamientoActual}</p>
        </section>

        {/* Tarjeta de Medicamentos */}
        <section className="dashboard-card">
          <h3>Medicamentos Activos</h3>
          <button 
            className="primary-btn"
            onClick={() => navigate('/medicamentos')}
          >
            Gestionar Medicamentos
          </button>
        </section>

        {/* Tarjeta de Farmacias */}
        <section className="dashboard-card">
          <h3>Comparador de Precios</h3>
          <button
            className="primary-btn"
            onClick={() => navigate('/farmacias')}
          >
            Buscar en Farmacias
          </button>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
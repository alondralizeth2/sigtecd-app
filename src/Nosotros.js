import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.jpg';
import './App.css';

const Nosotros = () => {
  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="nav-buttons">
          <Link to="/" className="nav-btn inicio-btn">Inicio</Link>
        </nav>
      </header>

      <h1 className="about-title">Sobre nosotros</h1>

      {/* Sección Problemática full width */}
      <section className="about-section full-width">
        <h2>Problemática</h2>
        <p className="about-content">
        La falta de adherencia terapéutica — que oscila entre el 50% y 60% según la OMS — se traduce en complicaciones
prevenibles, hospitalizaciones recurrentes y progresión acelerada de estas enfermedades, especialmente en pacientes con
regímenes de tratamiento complejos o limitado acceso a seguimiento médico, por ejemplo, las enfermedades crónico-
degenerativas (ECD), como la diabetes, hipertensión y enfermedades cardiovasculares, representan un desafío crítico en
salud pública debido a su alta prevalencia y al impacto devastador en la calidad de vida de quienes las padecen. Esta
situación se ve agravada por la ausencia de un sistema integral de gestión que facilite el control continuo de los
tratamientos, ya que los pacientes carecen de herramientas estructuradas para recordar dosis, coordinar citas médicas o
recibir retroalimentación personalizada sobre su evolución.  La gestión integral de enfermedades crónico-degenerativas es
crucial en México para mejorar la adherencia terapéutica, reducir costos sanitarios y prevenir complicaciones en
poblaciones vulnerables, especialmente ante su creciente prevalencia.
        </p>
      </section>

      {/* Contenedor de doble columna */}
      <div className="two-column-grid">
        {/* Columna Objetivo */}
        <section className="about-section">
          <h2>Objetivo</h2>
          <p className="about-content">
          Inspirados en los principios de World Class Manufacturing (WCM), desarrollamos e implementamos un sistema integral de gestión de tratamientos para pacientes con enfermedades crónico-degenerativas. Este sistema aplica metodologías WCM para integrar tecnologías de monitoreo continuo, análisis predictivo de datos y protocolos de optimización de recursos. 
          Nuestro objetivo es aumentar la tasa de adherencia terapéutica en un 25% y reducir el costo promedio del tratamiento en un 10%, mediante la eliminación de desperdicios y la mejora continua.
          </p>
        </section>

        {/* Columna Quiénes somos */}
        <section className="about-section">
          <h2>Quienes desarrollamos este proyecto</h2>
          <p className="about-content">
          Somos estudiantes de la carrera de Ingeniería Biomédica, actualmente cursando el octavo semestre en el Tecnológico de Monterrey. Este proyecto representa nuestro trabajo final dentro del curso de desarrollo de tecnología médica, y ha sido diseñado con un propósito claro: contribuir de manera significativa a la mejora de la salud y calidad de vida de las personas. A través de la aplicación de nuestros conocimientos en tecnología, medicina y gestión de datos, buscamos desarrollar soluciones innovadoras que respondan a problemáticas reales dentro del sistema de salud. Este esfuerzo refleja nuestro compromiso profesional y humano con la sociedad.
          </p>
        </section>
      </div>

      {/* Agradecimientos full width */}
      <section className="about-section full-width">
        <h2>Agradecimientos</h2>
        <p className="about-content">
          Gracias a los que nos están ayudando con nuestro proyecto ❤️
        </p>
      </section>
    </div>
  );
};

export default Nosotros;
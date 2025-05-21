import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './App.css';

const Terminos = () => {
  const [aceptado, setAceptado] = useState(false);
  const navigate = useNavigate();

  const handleAceptar = async () => {
    if (aceptado && auth.currentUser) {
      try {
        await updateDoc(doc(db, 'usuarios', auth.currentUser.uid), {
          terminosAceptados: true,
          fechaAceptacion: new Date()
        });
        navigate('/cuestionario');
      } catch (error) {
        console.error('Error al aceptar términos:', error);
      }
    }
  };

  return (
    <div className="terminos-container">
      <h2>Términos y Condiciones de Uso</h2>
      <p className="actualizacion">Última actualización: abril 2025</p>
      
      <div className="terminos-content">
        <section>
          <h3>1. Aceptación de los términos</h3>
          <p>Al acceder o utilizar esta página web, aceptas estar legalmente obligado por estos Términos y Condiciones y por nuestra Política de Privacidad. Si no estás de acuerdo, te solicitamos no utilizar el sitio.</p>
        </section>

        <section>
          <h3>2. Propósito del sitio</h3>
          <p>Este sitio web ha sido creado exclusivamente con fines educativos, de investigación y de apoyo a pacientes en la gestión de sus tratamientos médicos. No sustituye en ningún caso la consulta médica profesional ni se utiliza para realizar diagnósticos o tratamientos médicos de manera directa.</p>
        </section>

        <section>
          <h3>3. Confidencialidad y protección de datos</h3>
          <p>Toda la información personal recolectada a través de encuestas o formularios será tratada de manera estrictamente confidencial y utilizada únicamente para fines del proyecto académico. No compartiremos, venderemos ni divulgaremos tus datos a terceros sin tu consentimiento explícito, salvo que sea requerido por ley. Implementamos medidas razonables de seguridad para proteger tus datos personales.</p>
        </section>

        <section>
          <h3>4. Uso de la información</h3>
          <p>El usuario se compromete a proporcionar información veraz y actualizada en los formularios o herramientas de seguimiento. La información obtenida de farmacias y fuentes públicas es utilizada de forma legítima y con fines de análisis académico. No se realiza ninguna comercialización ni alteración de los datos originales.</p>
        </section>

        <section>
          <h3>5. Propiedad intelectual</h3>
          <p>Todo el contenido de este sitio, incluyendo textos, gráficos, logotipos, íconos, imágenes, y software, es propiedad de los desarrolladores del proyecto o de sus respectivos propietarios, y está protegido por las leyes de propiedad intelectual. El contenido no puede ser copiado, reproducido, distribuido, transmitido o explotado de ninguna forma sin autorización previa por escrito.</p>
        </section>

        <section>
          <h3>6. Responsabilidad</h3>
          <p>El equipo desarrollador no se hace responsable de decisiones médicas o de salud basadas en la información proporcionada en el sitio. Este sitio puede contener enlaces a sitios externos. No somos responsables por el contenido ni las prácticas de privacidad de dichos sitios.</p>
        </section>

        <section>
          <h3>7. Modificaciones</h3>
          <p>Nos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento, notificándolo a través del sitio web. Es responsabilidad del usuario revisar periódicamente los términos.</p>
        </section>

        <section>
          <h3>8. Contacto</h3>
          <p>Todo el contenido de este sitio, incluyendo textos, gráficos, logotipos, íconos, imágenes, y software, es propiedad de los desarrolladores del proyecto o de sus respectivos propietarios, y está protegido por las leyes de propiedad intelectual. El contenido no puede ser copiado, reproducido, distribuido, transmitido o explotado de ninguna forma sin autorización previa por escrito.</p>
        </section>

        {/* Repite la misma estructura para las demás secciones */}

        <section>
          <h3>POLÍTICA DE PRIVACIDAD</h3>
          <p className="actualizacion">Última actualización: abril 2025</p>
          
          <h4>1. ¿Qué datos recopilamos?</h4>
          <ul>
            <li>Datos personales: nombre, edad, correo electrónico, ciudad de residencia</li>
            <li>Datos de uso: información sobre tu interacción con el sitio</li>
            <li>Datos técnicos: dirección IP, tipo de navegador, sistema operativo</li>
          </ul>

          <h4>2. ¿Cómo usamos tus datos?</h4>
          <ul>
            <li>Realizar análisis estadísticos y académicos</li>
            <li>Mejorar la plataforma</li>
            <li>Desarrollar estrategias de gestión de tratamientos</li>
          </ul>

          {/* Continúa con las demás secciones de la política */}

        </section>
      </div>

      <div className="aceptacion-container">
        <label>
          <input
            type="checkbox"
            checked={aceptado}
            onChange={(e) => setAceptado(e.target.checked)}
          />
          He leído y acepto los Términos y Condiciones
        </label>
        
        <button 
          onClick={handleAceptar}
          disabled={!aceptado}
          className="btn-aceptar"
        >
          Continuar al cuestionario
        </button>
      </div>
    </div>
  );
};

export default Terminos;
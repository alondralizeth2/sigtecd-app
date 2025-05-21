import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const VerifyEmailLink = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // 1. Validar si el enlace es de verificación
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error("Enlace inválido o expirado");
        }

        // 2. Obtener el email del localStorage
        let storedEmail = localStorage.getItem("emailForVerification");
        
        // Si no está en localStorage, pedirlo al usuario
        if (!storedEmail) {
          storedEmail = prompt("Por favor, ingresa el correo que usaste para registrarte:");
          if (!storedEmail) {
            navigate("/registro");
            return;
          }
        }

        // 3. Autenticar al usuario con el enlace
        const userCredential = await signInWithEmailLink(
          auth,
          storedEmail,
          window.location.href
        );

        // 4. Forzar actualización del estado de emailVerified
        await userCredential.user.reload();

        // 5. Sincronizar Firestore con el estado de Auth
        await updateDoc(doc(db, "usuarios", userCredential.user.uid), {
          emailVerificado: userCredential.user.emailVerified,
        });

        // 6. Limpiar localStorage y redirigir
        localStorage.removeItem("emailForVerification");
        navigate("/terminos"); // Redirige a términos y condiciones

      } catch (error) {
        console.error("Error en verificación:", error);
        navigate("/error-verificacion", { 
          state: { error: "No se pudo completar la verificación. " + error.message } 
        });
      }
    };

    handleVerification();
  }, [navigate]);

  return (
    <div className="verification-container">
      <h2>Verificando tu correo electrónico...</h2>
      <p>Por favor espera un momento.</p>
    </div>
  );
};

export default VerifyEmailLink;
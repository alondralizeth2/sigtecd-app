import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const VerifyEmailLink = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // 1. Verificar si el correo ya está confirmado
        const user = auth.currentUser;
        if (!user) {
          throw new Error("Usuario no autenticado");
        }

        // 2. Forzar reautenticación para actualizar estado
        await user.reload();
        if (!user.emailVerified) {
          throw new Error("Correo no verificado");
        }

        // 3. Actualizar Firestore
        await updateDoc(doc(db, "usuarios", user.uid), {
          emailVerificado: true
        });

        // 4. Redirigir
        navigate("/terminos");

      } catch (error) {
        console.error("Error en verificación:", error);
        navigate("/error-verificacion", { state: { error: error.message } });
      }
    };

    handleVerification();
  }, [navigate]);

  return <div>Verificando tu correo electrónico...</div>;
};

export default VerifyEmailLink;
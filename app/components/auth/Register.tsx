// Importamos algunos componentes y hooks de React y otras librerías
import { useGeneralStore } from "@/app/stores/general"; // Importa el contexto general de la aplicación
import TextInput from "../TextInput"; // Importa el componente personalizado de entrada de texto
import { useState } from "react"; // Importa el hook useState de React
import { ShowErrorObject } from "@/app/types"; // Importa el tipo ShowErrorObject desde la ubicación especificada
import { useUser } from "@/app/context/user"; // Importa el contexto de usuario
import { BiLoaderCircle } from "react-icons/bi"; // Importa un icono giratorio de React
import { useRouter } from "next/navigation"; // Importa el enrutador de Next.js

// Creamos un componente llamado Register que permite al usuario registrarse
export default function Register() {
  // Obtenemos una función para cambiar el estado de la ventana de inicio de sesión
  let { setIsLoginOpen } = useGeneralStore(); // Obtiene la función para abrir o cerrar la ventana de inicio de sesión

  // Obtenemos el contexto del usuario y el router de Next.js
  const contextUser = useUser(); // Obtiene el contexto del usuario
  const router = useRouter(); // Obtiene el objeto del enrutador de Next.js

  // Definimos algunos estados locales para guardar los datos del formulario y los errores
  const [loading, setLoading] = useState<boolean>(false); // Estado para controlar la carga
  const [name, setName] = useState<string | "">(""); // Estado para el nombre
  const [email, setEmail] = useState<string | "">(""); // Estado para el correo electrónico
  const [password, setPassword] = useState<string | "">(""); // Estado para la contraseña
  const [confirmPassword, setConfirmPassword] = useState<string | "">(""); // Estado para confirmar la contraseña
  const [error, setError] = useState<ShowErrorObject | null>(null); // Estado para almacenar errores

  // Definimos una función para mostrar el mensaje de error según el tipo
  const showError = (type: string) => {
    if (error && Object.entries(error).length > 0 && error?.type == type) {
      return error.message;
    }
    return "";
  };

  // Definimos una función para validar los datos del formulario y establecer los errores si los hay
  const validate = () => {
    setError(null); // Restablece el estado de error
    let isError = false; // Inicializa una bandera de error como falso

    // Usamos una expresión regular para validar el formato del email
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Expresión regular para validar el correo electrónico

    // Verificamos que todos los campos estén llenos y que el email sea válido
    if (!name) {
      setError({ type: "name", message: "A Name is required" });
      isError = true; // Establece un error si el nombre está vacío
    } else if (!email) {
      setError({ type: "email", message: "An Email is required" });
      isError = true; // Establece un error si el correo electrónico está vacío
    } else if (!reg.test(email)) {
      setError({ type: "email", message: "The Email is not valid" });
      isError = true; // Establece un error si el correo electrónico no es válido según la expresión regular
    } else if (!password) {
      setError({ type: "password", message: "A Password is required" });
      isError = true; // Establece un error si la contraseña está vacía
    } else if (password.length < 8) {
      setError({
        type: "password",
        message: "The Password needs to be longer",
      });
      isError = true; // Establece un error si la contraseña es demasiado corta
    } else if (password != confirmPassword) {
      setError({ type: "password", message: "The Passwords do not match" });
      isError = true; // Establece un error si las contraseñas no coinciden
    }
    return isError; // Devuelve true si se encontraron errores, de lo contrario, devuelve false
  };

  // Definimos una función asíncrona para registrar al usuario usando el contexto y el router
  const register = async () => {
    // Validamos los datos y salimos si hay algún error
    let isError = validate();
    if (isError) return;
    if (!contextUser) return;

    try {
      // Cambiamos el estado de carga a verdadero y llamamos al método register del contexto del usuario
      setLoading(true);
      await contextUser.register(name, email, password);

      // Si todo sale bien, cambiamos el estado de carga a falso y cerramos la ventana de inicio de sesión
      setLoading(false);
      setIsLoginOpen(false);

      // Actualizamos la página usando el router de Next.js
      router.refresh();
    } catch (error) {
      // Si hay algún error, lo mostramos por la consola y por una alerta
      console.log(error);
      setLoading(false);
      alert(error);
    }
  };

  // Retornamos el JSX que renderiza el formulario de registro con los componentes TextInput y el icono BiLoaderCircle
  return (
    <>
      <div>
        <h1 className="text-center text-[28px] mb-4 font-bold">Register</h1>

        <div className="px-6 pb-2">
          <TextInput
            string={name}
            placeholder="Name"
            onUpdate={setName}
            inputType="text"
            error={showError("name")}
          />
        </div>

        <div className="px-6 pb-2">
          <TextInput
            string={email}
            placeholder="Email address"
            onUpdate={setEmail}
            inputType="email"
            error={showError("email")}
          />
        </div>

        <div className="px-6 pb-2">
          <TextInput
            string={password}
            placeholder="Password"
            onUpdate={setPassword}
            inputType="password"
            error={showError("password")}
          />
        </div>

        <div className="px-6 pb-2">
          <TextInput
            string={confirmPassword}
            placeholder="Confirm Password"
            onUpdate={setConfirmPassword}
            inputType="password"
            error={showError("password")}
          />
        </div>
      </div>
    </>
  );
}

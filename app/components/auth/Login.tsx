// Importa el componente TextInput, que es un campo de entrada personalizado, desde "../TextInput".
import TextInput from "../TextInput";
// Importa el hook useState, que permite manejar el estado de los componentes, desde "react".
import { useState } from "react";
// Importa el tipo ShowErrorObject, que define la estructura de un objeto de error, desde "@/app/types".
import { ShowErrorObject } from "@/app/types";
// Importa el hook useUser, que permite acceder al contexto del usuario, desde "@/app/context/user".
import { useUser } from "@/app/context/user";
// Importa el hook useGeneralStore, que permite acceder al estado general de la aplicación, desde "@/app/stores/general".
import { useGeneralStore } from "@/app/stores/general";
// Importa el icono BiLoaderCircle, que muestra un círculo giratorio, desde "react-icons/bi".
import { BiLoaderCircle } from "react-icons/bi";

// Define la función Login, que devuelve un elemento JSX con la interfaz de inicio de sesión.
export default function Login() {
  // Declara la variable setIsLoginOpen, que es una función para cambiar el estado de si el modal de inicio de sesión está abierto o no, usando el hook useGeneralStore.
  let { setIsLoginOpen } = useGeneralStore();

  // Declara la variable contextUser, que es el objeto del usuario actual, usando el hook useUser.
  const contextUser = useUser();

  // Declara las variables loading, email, password y error, que son estados para manejar el proceso de inicio de sesión, usando el hook useState. Inicializa loading como false, email y password como cadenas vacías y error como null.
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | "">("");
  const [password, setPassword] = useState<string | "">("");
  const [error, setError] = useState<ShowErrorObject | null>(null);

  // Define la función showError, que recibe un tipo de error como parámetro y devuelve el mensaje de error correspondiente si existe. Usa la variable error para comprobar si hay algún error y si su tipo coincide con el parámetro.
  const showError = (type: string) => {
    if (error && Object.entries(error).length > 0 && error?.type == type) {
      return error.message;
    }
    return "";
  };

  // Define la función validate, que valida los datos de inicio de sesión y devuelve un valor booleano que indica si hay algún error o no. Usa las variables email y password para comprobar si están vacías y usa la función setError para asignar un objeto de error con el tipo y el mensaje adecuados. Usa la variable isError para guardar el resultado de la validación.
  const validate = () => {
    setError(null);
    let isError = false;

    if (!email) {
      setError({ type: "email", message: "An Email is required" });
      isError = true;
    } else if (!password) {
      setError({ type: "password", message: "A Password is required" });
      isError = true;
    }
    return isError;
  };

  // Define la función login, que realiza el inicio de sesión con los datos introducidos por el usuario. Usa la función validate para comprobar si hay algún error y salir si lo hay. Si no hay contexto del usuario, también sale. Si no hay errores ni problemas con el contexto del usuario, intenta iniciar sesión usando la función contextUser.login y pasa los parámetros email y password. Usa las funciones setLoading y setIsLoginOpen para cambiar los estados de carga y modal respectivamente. Si ocurre algún error durante el inicio de sesión, lo muestra por consola y por una alerta.
  const login = async () => {
    let isError = validate();
    if (isError) return;
    if (!contextUser) return;

    try {
      setLoading(true);
      await contextUser.login(email, password);
      setLoading(false);
      setIsLoginOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error);
    }
  };

  // Devuelve un elemento JSX con la interfaz de inicio de sesión. Usa el componente TextInput para mostrar los campos de email y contraseña. Usa las variables email y password para guardar los valores introducidos por el usuario. Usa las funciones setEmail y setPassword para actualizar los estados de email y contraseña respectivamente. Usa la función showError para mostrar los mensajes de error si los hay. Usa el icono BiLoaderCircle para mostrar un indicador de carga si loading es true. Usa la función login para realizar el inicio de sesión al hacer clic en el botón Log in. Usa la variable setIsLoginOpen para cerrar el modal de inicio de sesión si el inicio de sesión es exitoso.
  return (
    <>
      <div>
        <h1 className="text-center text-[28px] mb-4 font-bold">Log in</h1>

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

        <div className="px-6 pb-2 mt-6">
          <button
            disabled={loading}
            onClick={() => login()}
            className={`
                            flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm
                            ${!email || !password
                ? "bg-gray-200"
                : "bg-[#2c77f0]"
              }
                        `}
          >
            {loading ? (
              <BiLoaderCircle
                className="animate-spin"
                color="#ffffff"
                size={25}
              />
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

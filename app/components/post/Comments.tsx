// Importamos el hook useState de React y otros componentes personalizados
import { useState } from "react"; // Importa el hook useState de React
import SingleComment from "./SingleComment"; // Importa el componente SingleComment
import { useUser } from "@/app/context/user"; // Importa el contexto de usuario
import { BiLoaderCircle } from "react-icons/bi"; // Importa un icono giratorio de React
import ClientOnly from "../ClientOnly"; // Importa el componente ClientOnly
import { useCommentStore } from "@/app/stores/comment"; // Importa el store de comentarios
import useCreateComment from "@/app/hooks/useCreateComment"; // Importa el hook personalizado useCreateComment
import { useGeneralStore } from "@/app/stores/general"; // Importa el store general de la aplicación
import { CommentsCompTypes } from "@/app/types"; // Importa el tipo CommentsCompTypes

// Creamos un componente llamado Comments que recibe un objeto params como prop
export default function Comments({ params }: CommentsCompTypes) {
  // Obtenemos algunos estados y funciones de los stores personalizados
  let { commentsByPost, setCommentsByPost } = useCommentStore(); // Obtiene comentarios por publicación y función para establecer comentarios por publicación
  let { setIsLoginOpen } = useGeneralStore(); // Obtiene la función para abrir o cerrar la ventana de inicio de sesión

  // Obtenemos el contexto del usuario
  const contextUser = useUser(); // Obtiene el contexto del usuario

  // Definimos algunos estados locales para guardar el comentario, el foco del input y el estado de carga
  const [comment, setComment] = useState<string>(""); // Estado para el texto del comentario
  const [inputFocused, setInputFocused] = useState<boolean>(false); // Estado para rastrear si el input está enfocado
  const [isUploading, setIsUploading] = useState<boolean>(false); // Estado para rastrear la carga

  // Definimos una función asíncrona para agregar un comentario usando el hook personalizado useCreateComment
  const addComment = async () => {
    // Si no hay un usuario en el contexto, abrimos la ventana de inicio de sesión
    if (!contextUser?.user) return setIsLoginOpen(true);

    try {
      // Cambiamos el estado de carga a verdadero y llamamos al hook useCreateComment con los datos del usuario, el post y el comentario
      setIsUploading(true);
      await useCreateComment(contextUser?.user?.id, params?.postId, comment);
      // Actualizamos los comentarios del post usando la función del store
      setCommentsByPost(params?.postId);
      // Limpiamos el estado del comentario y cambiamos el estado de carga a falso
      setComment("");
      setIsUploading(false);
    } catch (error) {
      // Si hay algún error, lo mostramos por la consola y por una alerta
      console.log(error);
      alert(error);
    }
  };

  // Retornamos el JSX que renderiza los comentarios y el formulario para crear uno nuevo
  return (
    <>
      <div
        id="Comments"
        className="relative bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
      >
        <div className="pt-2" />

        <ClientOnly>
          {commentsByPost.length < 1 ? (
            // Si no hay comentarios, mostramos un mensaje
            <div className="text-center mt-6 text-xl text-gray-500">
              No comments...
            </div>
          ) : (
            // Si hay comentarios, los mapeamos usando el componente SingleComment
            <div>
              {commentsByPost.map((comment, index) => (
                <SingleComment key={index} comment={comment} params={params} />
              ))}
            </div>
          )}
        </ClientOnly>

        <div className="mb-28" />
      </div>

      <div
        id="CreateComment"
        className="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
      >
        <div
          className={`
            bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px]
            ${inputFocused
              ? "border-2 border-gray-400"
              : "border-2 border-[#F1F1F2]"
            }
          `}
        >
          // Usamos un input para capturar el texto del comentario y cambiar el estado local con la función setComment.
          <input
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onChange={(e) => setComment(e.target.value)}
            value={comment || ""}
            className="bg-[#F1F1F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
            type="text"
            placeholder="Add comment..."
          />
        </div>
        {!isUploading ? (
          // Si no estamos cargando, mostramos un botón para enviar el comentario que llama a la función addComment
          <button
            disabled={!comment}
            onClick={() => addComment()}
            className={`
              font-semibold text-sm ml-5 pr-1
              ${comment ? "text-[#F02C56] cursor-pointer" : "text-gray-400"}
            `}
          >
            Post
          </button>
        ) : (
          // Si estamos cargando, mostramos un icono de carga animado
          <BiLoaderCircle className="animate-spin" color="#E91E62" size="20" />
        )}
      </div>
    </>
  );
}

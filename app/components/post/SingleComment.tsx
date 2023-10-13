import { useUser } from "@/app/context/user"; // Importa la función useUser desde un módulo llamado "@/app/context/user".
import Link from "next/link"; // Importa el componente Link de la biblioteca "next/link".
import { useState } from "react"; // Importa la función useState de la biblioteca "react".
import { BiLoaderCircle } from "react-icons/bi"; // Importa el icono BiLoaderCircle de la biblioteca "react-icons".
import { BsTrash3 } from "react-icons/bs"; // Importa el icono BsTrash3 de la biblioteca "react-icons".
import { useCommentStore } from "@/app/stores/comment"; // Importa la función useCommentStore desde un módulo llamado "@/app/stores/comment".
import moment from "moment"; // Importa la biblioteca "moment" para el formateo de fechas.
import useDeleteComment from "@/app/hooks/useDeleteComment"; // Importa la función useDeleteComment desde un módulo llamado "@/app/hooks/useDeleteComment".
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"; // Importa la función useCreateBucketUrl desde un módulo llamado "@/app/hooks/useCreateBucketUrl".
import { SingleCommentCompTypes } from "@/app/types"; // Importa el tipo SingleCommentCompTypes desde un módulo llamado "@/app/types".

export default function SingleComment({
  comment,
  params,
}: SingleCommentCompTypes) {
  // Define un componente React llamado SingleComment que recibe las propiedades comment y params.

  const contextUser = useUser(); // Obtiene el usuario actual utilizando la función useUser.
  let { setCommentsByPost } = useCommentStore(); // Obtiene la función setCommentsByPost desde useCommentStore.
  const [isDeleting, setIsDeleting] = useState(false); // Crea un estado local llamado isDeleting y una función setIsDeleting para rastrear si se está eliminando un comentario.

  // Función para eliminar un comentario.
  const deleteThisComment = async () => {
    let res = confirm("Are you sure you want to delete this comment?"); // Muestra una confirmación al usuario antes de eliminar el comentario.
    if (!res) return; // Si el usuario cancela la confirmación, la función sale.

    try {
      setIsDeleting(true); // Establece isDeleting en true para indicar que se está eliminando el comentario.
      await useDeleteComment(comment?.id); // Utiliza la función useDeleteComment para eliminar el comentario.
      setCommentsByPost(params?.postId); // Actualiza los comentarios para el post asociado.
      setIsDeleting(false); // Restablece isDeleting a false después de completar la eliminación.
    } catch (error) {
      console.log(error); // Registra cualquier error en la consola.
      alert(error); // Muestra una alerta con el mensaje de error.
    }
  };

  return (
    <>
      <div
        id="SingleComment"
        className="flex items-center justify-between px-8 mt-4"
      >
        // Renderiza un contenedor con ID "SingleComment" y aplica estilos CSS.
        <div className="flex items-center relative w-full">
          <Link href={`/profile/${comment.profile.user_id}`}>
            // Crea un enlace al perfil del usuario que hizo el comentario.
            <img
              className="absolute top-0 rounded-full lg:mx-0 mx-auto"
              width="40"
              src={useCreateBucketUrl(comment.profile.image)}
            />
          </Link>
          <div className="ml-14 pt-0.5 w-full">
            // Renderiza el contenido del comentario y aplica estilos.
            <div className="text-[18px] font-semibold flex items-center justify-between">
              // Muestra el nombre del autor y la fecha del comentario.
              <span className="flex items-center">
                {comment?.profile?.name} -
                <span className="text-[12px] text-gray-600 font-light ml-1">
                  {moment(comment?.created_at).calendar()} // Formatea la fecha
                  utilizando la biblioteca "moment".
                </span>
              </span>

              // Si el usuario actual es el autor, muestra un botón de eliminación.
              {contextUser?.user?.id == comment.profile.user_id ? (
                <button
                  disabled={isDeleting}
                  onClick={() => deleteThisComment()}
                >
                  {
                    isDeleting ? (
                      <BiLoaderCircle
                        className="animate-spin"
                        color="#E91E62"
                        size="20"
                      /> // Muestra un icono de carga mientras se elimina.
                    ) : (
                      <BsTrash3 className="cursor-pointer" size="25" />
                    ) // Muestra un icono de eliminación.
                  }
                </button>
              ) : null}
            </div>
            <p className="text-[15px] font-light">{comment.text}</p> // Muestra
            el texto del comentario.
          </div>
        </div>
      </div>
    </>
  );
}

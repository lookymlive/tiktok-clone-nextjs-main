import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { BsChatDots, BsTrash3 } from "react-icons/bs";
import { ImMusic } from "react-icons/im";
import moment from "moment";
import { useUser } from "@/app/context/user";
import { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import ClientOnly from "../ClientOnly";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import { useLikeStore } from "@/app/stores/like";
import { useCommentStore } from "@/app/stores/comment";
import { useGeneralStore } from "@/app/stores/general";
import { useRouter } from "next/navigation";
import useIsLiked from "@/app/hooks/useIsLiked";
import useCreateLike from "@/app/hooks/useCreateLike";
import useDeleteLike from "@/app/hooks/useDeleteLike";
import useDeletePostById from "@/app/hooks/useDeletePostById";
import { CommentsHeaderCompTypes } from "@/app/types";

// Definición del componente CommentsHeader, que acepta 'post' y 'params' como props.
export default function CommentsHeader({
  post,
  params,
}: CommentsHeaderCompTypes) {
  // Declaración de variables de estado y acceso a tiendas y hooks.
  let { setLikesByPost, likesByPost } = useLikeStore();
  let { commentsByPost, setCommentsByPost } = useCommentStore();
  let { setIsLoginOpen } = useGeneralStore();
  const contextUser = useUser();
  const router = useRouter();
  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  useEffect(() => {
    // Cargar comentarios y "me gusta" cuando el 'post' cambia.
    // Actualiza los comentarios y los "me gusta" cuando el post cambia.
    setCommentsByPost(params?.postId);
    setLikesByPost(params?.postId);
  }, [post]);

  useEffect(() => {
    // Comprobar si el usuario ha dado "me gusta" a la publicación.

    hasUserLikedPost();
  }, [likesByPost]);

  const hasUserLikedPost = () => {
    // Comprobar si el usuario ha dado "me gusta" a la publicación.
    // Determina si el usuario actual ha dado "me gusta" a la publicación.
    if (likesByPost.length < 1 || !contextUser?.user?.id) {
      setUserLiked(false);
      return;
    }
    let res = useIsLiked(contextUser.user.id, params.postId, likesByPost);
    setUserLiked(res ? true : false);
  };

  const like = async () => {
    // Dar "me gusta" a la publicación.
    // Realiza la acción de dar "me gusta" a la publicación.
    try {
      setHasClickedLike(true);
      await useCreateLike(contextUser?.user?.id || "", params.postId);
      setLikesByPost(params.postId);
      setHasClickedLike(false);
    } catch (error) {
      console.log(error);
      alert(error);
      setHasClickedLike(false);
    }
  };

  const unlike = async (id: string) => {
    // Quitar el "me gusta" de la publicación
    // Realiza la acción de quitar el "me gusta" de la publicación.
    try {
      setHasClickedLike(true);
      await useDeleteLike(id);
      setLikesByPost(params.postId);
      setHasClickedLike(false);
    } catch (error) {
      console.log(error);
      alert(error);
      setHasClickedLike(false);
    }
  };

  const likeOrUnlike = () => {
    // Controlar si el usuario debe dar "me gusta" o quitarlo.
    if (!contextUser?.user) return setIsLoginOpen(true);

    let res = useIsLiked(contextUser.user.id, params.postId, likesByPost);
    if (!res) {
      like();
    } else {
      likesByPost.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser.user.id == like.user_id &&
          like.post_id == params.postId
        ) {
          unlike(like.id);
        }
      });
    }
  };

  const deletePost = async () => {
    // Borrar la publicación y redirigir al perfil del usuario.
    let res = confirm("Are you sure you want to delete this post?");
    if (!res) return;

    setIsDeleting(true);

    try {
      await useDeletePostById(params?.postId, post?.video_url);
      router.push(`/profile/${params.userId}`);
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
      alert(error);
    }
  };
  return (
    <>
      {/* Renderizado de la cabecera de la publicación. */}
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center">
          <Link href={`/profile/${post?.user_id}`}>
            {post?.profile.image ? (
              // Mostrar la imagen del perfil si está disponible.
              <img
                className="rounded-full lg:mx-0 mx-auto"
                width="40"
                src={useCreateBucketUrl(post?.profile.image)}
              />
            ) : (
              // Si no hay imagen de perfil, mostrar un avatar predeterminado.
              <div className="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>
            )}
          </Link>
          <div className="ml-3 pt-0.5">
            <Link
              href={`/profile/${post?.user_id}`}
              className="relative z-10 text-[17px] font-semibold hover:underline"
            >
              {/* Enlace al perfil del usuario que hizo la publicación. */}
              {post?.profile.name}
            </Link>
            <div className="relative z-0 text-[13px] -mt-5 font-light">
              {/* Mostrar el nombre de usuario y la fecha de la publicación. */}
              {post?.profile.name}
              <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5">
                .
              </span>
              <span className="font-medium">
                {moment(post?.created_at).calendar()}
              </span>
            </div>
          </div>
        </div>

        {contextUser?.user?.id == post?.user_id ? (
          <div>
            {isDeleting ? (
              // Mostrar un spinner de carga si se está eliminando la publicación.
              <BiLoaderCircle className="animate-spin" size="25" />
            ) : (
              // Mostrar un botón para eliminar la publicación si el usuario actual es el autor.
              <button disabled={isDeleting} onClick={() => deletePost()}>
                <BsTrash3 className="cursor-pointer" size="25" />
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Mostrar el texto de la publicación. */}
      <p className="px-8 mt-4 text-sm">{post?.text}</p>

      {/* Mostrar información sobre la publicación, como el autor y la música original. */}
      <p className="flex item-center gap-2 px-8 mt-4 text-sm font-bold">
        <ImMusic size="17" />
        original sound - {post?.profile.name}
      </p>

      <div className="flex items-center px-8 mt-8">
        <ClientOnly>
          <div className="pb-4 text-center flex items-center">
            <button
              disabled={hasClickedLike}
              onClick={() => likeOrUnlike()}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
            >
              {!hasClickedLike ? (
                // Mostrar un corazón con color si el usuario ha dado "me gusta" a la publicación.
                <AiFillHeart
                  color={likesByPost.length > 0 && userLiked ? "#ff2626" : ""}
                  size="25"
                />
              ) : (
                // Mostrar un spinner de carga mientras se procesa la acción de "me gusta".
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              {/* Mostrar el número de "me gusta" en la publicación. */}
              {likesByPost.length}
            </span>
          </div>
        </ClientOnly>

        <div className="pb-4 text-center flex items-center">
          <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
            {/* Mostrar un ícono de chat para representar los comentarios. */}
            <BsChatDots size={25} />
          </div>
          <span className="text-xs pl-2 text-gray-800 font-semibold">
            {/* Mostrar el número de comentarios en la publicación. */}
            {commentsByPost?.length}
          </span>
        </div>
      </div>
    </>
  );
}

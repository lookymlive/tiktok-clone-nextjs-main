// Importa el hook useClient, que permite acceder al cliente de Apollo
"use client";

// Importa algunos componentes de React Icons
import { AiFillHeart } from "react-icons/ai";
import { ImMusic } from "react-icons/im";
// Importa el componente Link de Next.js, que permite crear enlaces entre páginas
import Link from "next/link";
// Importa el hook useEffect de React, que permite ejecutar efectos secundarios después de renderizar
import { useEffect } from "react";
// Importa el componente PostMainLikes, que muestra los likes de un post
import PostMainLikes from "./PostMainLikes";
// Importa el hook useCreateBucketUrl, que crea una URL para acceder al bucket de Amazon S3
import useCreateBucketUrl from "../hooks/useCreateBucketUrl";
// Importa el tipo PostMainCompTypes, que define las propiedades del componente PostMain
import { PostMainCompTypes } from "../types";

// Define el componente PostMain, que recibe un post como prop
export default function PostMain({ post }: PostMainCompTypes) {
  // Usa el hook useEffect para crear un observador de intersección que controle la reproducción del video
  useEffect(() => {
    // Obtiene el elemento video por su id, que es único para cada post
    const video = document.getElementById(
      `video-${post?.id}`
    ) as HTMLVideoElement;
    // Obtiene el elemento PostMain por su id, que también es único para cada post
    const postMainElement = document.getElementById(`PostMain-${post.id}`);

    // Si existe el elemento PostMain, crea un observador de intersección
    if (postMainElement) {
      // El observador recibe una función que se ejecuta cuando cambia la intersección del elemento con el viewport
      let observer = new IntersectionObserver(
        (entries) => {
          // Si el elemento está intersecando al menos un 60%, reproduce el video, sino lo pausa
          entries[0].isIntersecting ? video.play() : video.pause();
        },
        { threshold: [0.6] }
      );

      // El observador observa el elemento PostMain
      observer.observe(postMainElement);
    }
  }, []);

  // Retorna el JSX del componente, que muestra la información del post y el video
  return (
    <>
      <div id={`PostMain-${post.id}`} className="flex border-b py-6">
        <div className="cursor-pointer">
          {/* Muestra la imagen del perfil del usuario que hizo el post, usando el hook useCreateBucketUrl para obtener la URL */}
          <img
            className="rounded-full max-h-[60px]"
            width="60"
            src={useCreateBucketUrl(post?.profile?.image)}
          />
        </div>

        <div className="pl-3 w-full px-4">
          <div className="flex items-center justify-between pb-0.5">
            {/* Muestra el nombre del usuario que hizo el post, usando el componente Link para crear un enlace a su perfil */}
            <Link href={`/profile/${post.profile.user_id}`}>
              <span className="font-bold hover:underline cursor-pointer">
                {post.profile.name}
              </span>
            </Link>

            {/* Muestra un botón para seguir al usuario */}
            <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>
          {/* Muestra el texto del post */}
          <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
            {post.text}
          </p>
          {/* Muestra los hashtags del post */}
          <p className="text-[14px] text-gray-500 pb-0.5">
            #fun #cool #SuperAwesome
          </p>
          {/* Muestra algunos iconos y texto relacionados con el sonido y los likes del post */}
          <p className="text-[14px] pb-0.5 flex items-center font-semibold">
            <ImMusic size="17" />
            <span className="px-1">original sound - AWESOME</span>
            <AiFillHeart size="20" />
          </p>

          <div className="mt-2.5 flex">
            <div className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
              {/* Muestra el video del post, usando el hook useCreateBucketUrl para obtener la URL */}
              <video
                id={`video-${post.id}`}
                loop
                controls
                muted
                className="rounded-xl object-cover mx-auto h-full"
                src={useCreateBucketUrl(post?.video_url)}
              />
              {/* Muestra el logo de TikTok sobre el video */}
              <img
                className="absolute right-2 bottom-10"
                width="90"
                src="/images/tiktok-logo-white.png"
              />
            </div>

            {/* Muestra el componente PostMainLikes, que muestra los likes del post */}
            <PostMainLikes post={post} />
          </div>
        </div>
      </div>
    </>
  );
}

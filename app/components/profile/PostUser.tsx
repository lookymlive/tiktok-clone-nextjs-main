// Importamos algunos componentes de react-icons, que es una biblioteca que nos permite usar iconos de diferentes fuentes
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { SiSoundcharts } from "react-icons/si"
import { BiErrorCircle } from "react-icons/bi"

// Importamos el hook useEffect de React, que nos permite ejecutar código después de que el componente se haya renderizado
import { useEffect } from "react"


import Link from "next/link"// Importamos el componente Link de Next.js, que nos permite crear enlaces entre páginas de nuestra aplicación

// Importamos una función personalizada que nos devuelve la URL del video que queremos mostrar
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"

// Importamos una interfaz que define el tipo de las propiedades del componente PostUser
import { PostUserCompTypes } from "@/app/types"

// Definimos el componente PostUser, que recibe un objeto post como propiedad
export default function PostUser({ post }: PostUserCompTypes) {


    useEffect(() => {
        // Obtenemos el elemento video del DOM usando su id, que es una combinación de "video" y el id del post
        const video = document.getElementById(`video${post?.id}`) as HTMLVideoElement

        // Usamos setTimeout para ejecutar otra función después de 50 milisegundos
        setTimeout(() => {
            // Añadimos un evento al elemento video para que se reproduzca cuando el cursor entra en él
            video.addEventListener('mouseenter', () => { video.play() })

            video.addEventListener('mouseleave', () => { video.pause() })
        }, 50)

    }, [])

    return (
        <>
            <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">

                {!post.video_url ? (
                    // Si no tiene URL de video, mostramos un icono de carga con un fondo negro
                    <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
                        <AiOutlineLoading3Quarters className="animate-spin ml-1" size="80" color="#FFFFFF" />
                    </div>
                ) : (
                    // Si tiene URL de video, mostramos el elemento video envuelto en un componente Link para navegar a la página del post
                    <Link href={`/post/${post.id}/${post.user_id}`}>
                        <video
                            id={`video${post.id}`}
                            muted // El video se reproduce sin sonido
                            loop // El video se repite indefinidamente
                            className="aspect-[3/4] object-cover rounded-md"
                            src={useCreateBucketUrl(post.video_url)} // Usamos la función personalizada para obtener la URL del video
                        />
                    </Link>
                )}
                <div className="px-1">
                    {/* Mostramos el texto del post con un estilo gris y pequeño */}
                    <p className="text-gray-700 text-[15px] pt-1 break-words">
                        {post.text}
                    </p>
                    <div className="flex items-center gap-1 -ml-1 text-gray-600 font-bold text-xs">
                        {/* Mostramos dos iconos con un porcentaje y un círculo de error */}
                        <SiSoundcharts size="15" />
                        3%
                        <BiErrorCircle size="16" />
                    </div>
                </div>
            </div>
        </>
    )
}

import React from "react";
import SideNavMain from "./includes/SideNavMain";
import TopNav from "./includes/TopNav";
import { usePathname } from "next/navigation";

// Define el componente MainLayout
export default function MainLayout({ children }: { children: React.ReactNode }) {

	const pathname = usePathname();  // Obtiene la ruta actual

	return (
		<>

			<TopNav />  // Barra de navegación superior

			<div className={`flex justify-between mx-auto w-full lg:px-2.5 px-0 ${pathname == '/' ? 'max-w-[1140px]' : ''}`}>

				<SideNavMain /> // Barra lateral de navegación principal


				{children} // Contenido de la página -proporcionado como children-.
			</div>
		</>
	);

}

import { useAuthStore } from "@/context/UserContext";
import { ImovelItf } from "@/utils/types/ImovelItf";
import Link from "next/link"
import { useEffect, useState } from "react";
import ImovIcons from "./ImovIcons";

export default function AllCardImovel({ data } : { data : ImovelItf }){
    const { token } = useAuthStore()
    const [mediaRating, setMediaRating] = useState<number | null>(null);

    useEffect(() => {

        if (!data.id || !token) return; 

        async function buscaMedia() {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ratings/media/${data.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            console.error("Erro ao buscar média de avaliação:", response.status);
            setMediaRating(null);
            return;
          }

          const media = await response.json();
          setMediaRating(media);
        }

        buscaMedia();

    }, [])


     const primaryPhoto = data.photos.find(photo => photo.isPrimary);
    return( 
        <div className="flex flex-col gap-6 h-72 items-center overflow-hidden bg-white border border-gray-200 rounded-l-lg shadow-sm md:w-4xl md:flex-row">
            <img className="object-fill rounded-t-lg w-full h-96 md:h-full md:w-1/4 md:rounded-none md:rounded-s-lg" src={primaryPhoto ? primaryPhoto.url : "/no_image.jpg"} alt="" />
            <div className="flex flex-col gap-5 mt-12 h-full w-9/12 leading-normal">
              	<div className="flex flex-col">
					<h5 className="mb-2 text-[1rem] font-bold tracking-tight text-gray-900">{data.description}</h5>
              	  	<p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">{data.address}</p>
              	</div>
				<div className="flex gap-5">
					<span className="mb-3 flex gap-10 font-normal text-amber-400">{data.type}</span>
					{mediaRating !== null && (
                        <h1 className="font-bold text-amber-400">
                          {mediaRating.toFixed(1)} ★
                        </h1>
                    )}
				</div>
			  	
				<ImovIcons data={data}/>

				<div className="flex gap-10 items-center justify-center">
					{data.priceType === 'Venda' ? (
                	    <p className="mb-3 font-extrabold text-amber-400">
                	        Preço R$: {Number(data.price).toLocaleString("pt-br", {
                	            minimumFractionDigits: 2
                	        })}
                	    </p>
                	) : (
                	    <p className="mb-3 font-extrabold text-amber-400">
                	        Aluguel R$: {Number(data.price).toLocaleString("pt-br", {
                	            minimumFractionDigits: 2
                	        })} / mês
                	    </p>
                	)}
	
                	<Link href={`/details/${data.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-amber-400 rounded-lg hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 ">
                	    Ver Detalhes
                	    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                	        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                	    </svg>
                	</Link>
				</div>
            </div>
        </div>
    )
}
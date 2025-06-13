import { ImovelItf } from "@/utils/types/ImovelItf"
import Link from "next/link"
import ImovIcons from "./ImovIcons"
import { useEffect, useState } from "react";
import { useAuthStore } from "@/context/UserContext";

export function CardImovel({data} : {data: ImovelItf}){
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
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
            <img className="rounded-t-lg object-cover w-full" src={primaryPhoto ? primaryPhoto.url : "/no_image.jpg"} alt="Foto" />
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-700">
                    {data.description}
                </h5>
                <p className="mb-3 font-normal text-gray-500">
                    {data.address}
                </p>
                <div className="mb-3 flex gap-10 font-normal text-amber-400">
                    {data.type}

                    {mediaRating !== null && (
                          <h1 className="font-bold">
                            {mediaRating.toFixed(1)} ★
                          </h1>
                    )}
                </div>
                <div className="mb-3 font-normal text-gray-500">
                    <ImovIcons key={data.id} data={data}/>
                </div>
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
    )
}

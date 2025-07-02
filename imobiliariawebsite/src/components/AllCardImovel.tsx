import { useAuthStore } from "@/context/UserContext";
import { ImovelItf } from "@/utils/types/ImovelItf";
import Link from "next/link"
import { useEffect, useState } from "react";
import ImovIcons from "./ImovIcons";

export default function AllCardImovel({ data }: { data: ImovelItf }) {
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
    
    return (
        <div className="flex flex-col md:flex-row w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Imagem */}
            <div className="w-full md:w-1/3 h-48 md:h-auto">
                <img 
                    className="object-cover w-full h-full" 
                    src={primaryPhoto ? primaryPhoto.url : "/no_image.jpg"} 
                    alt={data.description} 
                />
            </div>
            
            {/* Conteúdo */}
            <div className="flex flex-col p-4 md:p-6 w-full md:w-2/3 gap-3">
                <div>
                    <h5 className="text-lg font-bold text-gray-900 line-clamp-1">{data.description}</h5>
                    <p className="text-sm text-gray-700 line-clamp-1">{data.address}</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="text-amber-400">{data.type}</span>
                    {mediaRating !== null && (
                        <span className="font-bold text-amber-400">
                            {mediaRating.toFixed(1)} ★
                        </span>
                    )}
                </div>
                
                <ImovIcons data={data} />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <div className="font-extrabold text-amber-400">
                        {data.priceType === 'Venda' ? (
                            `Preço R$: ${Number(data.price).toLocaleString("pt-br", {
                                minimumFractionDigits: 2
                            })}`
                        ) : (
                            `Aluguel R$: ${Number(data.price).toLocaleString("pt-br", {
                                minimumFractionDigits: 2
                            })} / mês`
                        )}
                    </div>
                    
                    <Link 
                        href={`/details/${data.id}`} 
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-amber-400 rounded-lg hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300"
                    >
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
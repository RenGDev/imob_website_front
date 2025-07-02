"use client"
import { Carousel } from "@/components/Carousel";
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useAuthStore } from '@/context/UserContext'
import ImovIcons from "@/components/ImovIcons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RatingStars from "@/components/RatingStars";

export default function Detalhes() {
  const { user, token } = useAuthStore()
  const params = useParams()
  const id = params.imovel_id

  const [imoveis, setImoveis] = useState<ImovelItf>()
  const [mediaRating, setMediaRating] = useState<number | null>(null)

  const { handleSubmit } = useForm()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list/${id}`)
      const dados = await response.json()
      setImoveis(dados)
    }

    if (!id || !token) return;

    async function buscaMedia() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ratings/media/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.ok) {
          const media = await response.json()
          setMediaRating(media)
        }
      } catch (error) {
        console.error("Erro ao buscar média de avaliação:", error)
      }
    }

    buscaMedia()
    buscaDados()    
  }, [id, token])

  async function enviaProposta() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user_imovel/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.id,
          imovelId: Number(params.imovel_id),
        })
      })

      if (response.ok) {
        toast.success("Proposta enviada com sucesso")
      } else {
        toast.error("Erro... Não foi possível enviar sua proposta")
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor")
    }
  }

  return (
    <main className="bg-white">
      {/* Seção do Carrossel */}
      <section className="mt-6 md:mt-10 w-full px-4 sm:px-6 lg:px-8 xl:px-20">
        {imoveis?.photos && (
          <div className="flex flex-col gap-4">
            <Carousel key={imoveis.id} imovel={imoveis}/>
          </div>
        )}
      </section>

      {/* Seção de Detalhes */}
      <section className="pb-16">
        <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-chart-4">
            {imoveis?.description} - ({imoveis?.type})
          </h1>

          <div className="flex flex-col gap-8 ml-0 md:ml-5">
            {/* Informações Principais */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16"> 
              <div className="flex-1">
                <h2 className="text-sm md:text-base text-gray-500">Valor</h2>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {Number(imoveis?.price).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </h1>
              </div>
              
              <div className="flex-1">
                <h2 className="text-sm md:text-base text-gray-500">Endereço</h2>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                  {imoveis?.address}
                </h1>
              </div>
              
              {mediaRating !== null && (
                <div className="flex-1">
                  <h2 className="text-sm md:text-base text-gray-500">Avaliação média</h2>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {mediaRating.toFixed(1)} ★
                  </h1>
                </div>
              )}
            </div>
            
            {/* Ícones de Características */}
            {imoveis && <ImovIcons key={imoveis.id} data={imoveis} />}

            {/* Formulário de Proposta */}
            {user?.id ? (
              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Você pode fazer uma proposta para este imóvel!
                </h3>
                <form onSubmit={handleSubmit(enviaProposta)} className="mt-4 max-w-md">
                  <input 
                    type="text" 
                    className="mb-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" 
                    value={`${user.name} (${user.email})`} 
                    disabled 
                    readOnly 
                  />
                  
                  <button 
                    type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-200"
                  >
                    Enviar Proposta
                  </button>
                </form>
              </div>
            ) : (
              <h2 className="text-lg md:text-xl text-amber-500 font-medium mt-4">
                Gostou do imóvel? Faça login na sua conta para enviar uma proposta
              </h2>
            )}

            {/* Avaliação */}
            <div className="mt-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Avalie este imóvel:</h3>
              <RatingStars
                onRate={async (rating) => {
                  if (!user?.id) {
                    toast.error("Você precisa estar logado para avaliar");
                    return;
                  }

                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ratings/rate`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        score: rating,
                        user: { id: user?.id },
                        imovel: { id: Number(id) }
                      })
                    });
                  
                    if (res.ok) {
                      toast.success("Avaliação enviada com sucesso!");
                      window.location.reload();
                    } else {
                      toast.error("Erro ao enviar avaliação. Você já avaliou?");
                    }
                  } catch (error) {
                    toast.error("Erro na comunicação com o servidor");
                  }
                }}
              />
            </div>
          </div>
        </div>      
      </section>
    </main>
  )
}
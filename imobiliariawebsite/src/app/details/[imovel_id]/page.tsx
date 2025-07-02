"use client"
import { Carousel } from "@/components/Carousel";
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useAuthStore } from '@/context/UserContext'

import 'flowbite';
import ImovIcons from "@/components/ImovIcons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RatingStars from "@/components/RatingStars";

export default function Detalhes() {

  const { user, token } = useAuthStore()

  const params = useParams()

  const id = params.imovel_id

  const [imoveis, setImoveis] = useState<ImovelItf>()
  const [mediaRating, setMediaRating] = useState<number | null>(null);

  const { handleSubmit } = useForm()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list/${id}`)
      console.log(response)
      const dados = await response.json()
      // console.log(dados)
      setImoveis(dados)
    }

    if (!id || !token) return;

    async function buscaMedia() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/ratings/media/${id}`, {
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
    buscaDados()    
  }, [id, token])

  async function enviaProposta() {

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

    if (response.status == 200) {
          toast.success("Proposta enviada com sucesso")   
          console.log("sucesso")
        } else {
          toast.error("Erro... Não foi possível mandar sua proposta")
        }
  }

  return (
    <>
      <section className="mt-10 w-full px-20">

        {imoveis?.photos &&
          <div className="flex flex-col gap-2">
            <Carousel key={imoveis.id} imovel={imoveis}/>
            <button className="border-2 border-solid flex justify-center cursor-pointer border-black w-3 py-3 px-7 text-2xl">+</button>
          </div>
        }
      
      </section>
      <section>

        <div className="flex flex-col gap-6 px-20 py-16">
          <h1 className="text-4xl text-chart-4 font-extrabold">{imoveis?.description} - ({imoveis?.type})</h1>

          <div className="flex flex-col ml-5 gap-10">

            <div className="flex gap-16"> 
              <div>
                <h2 className="text-[1.1rem] text-gray-500">Valor</h2>
                <h1 className="text-3xl font-bold">
                  {Number(imoveis?.price).toLocaleString("pt-br", {
                            minimumFractionDigits: 2
                  })}R$
                </h1>
              </div>
              <div>
                <h2 className="text-[1.1rem] text-gray-500">Endereço</h2>
                <h1 className="text-3xl font-bold">{imoveis?.address}</h1>
              </div>
              {mediaRating !== null && (
                <div>
                  <h2 className="text-[1.1rem] text-gray-950">Avaliação média</h2>
                  <h1 className="text-3xl font-bold">
                    {mediaRating.toFixed(1)} ★
                  </h1>
                </div>
              )}
            </div>
            
            {imoveis && <ImovIcons key={imoveis.id} data={imoveis} />}

          </div>
          {user?.id ?
                <>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">
                    Você pode fazer uma Proposta para este imovel!</h3>
                    <form onSubmit={handleSubmit(enviaProposta)}>
                      <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={`${user.name} (${user.email})`} disabled readOnly />
                      
                      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Enviar Proposta</button>
                    </form>
                </>
                :
                <h2 className="mb-2 mt-3 text-xl tracking-tight text-amber-400">
                  Gostou do imovel? Faça log-in na sua conta para salvar
                </h2>
          }

          <h3 className="text-xl font-semibold mt-8">Avalie este imóvel:</h3>
          <RatingStars
            onRate={async (rating) => {
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
                window.location.reload()
              } else {
                toast.error("Erro ao enviar avaliação. Você já avaliou?");
              }
            }}
          />
        </div>      
      </section>
    </>
  )
}

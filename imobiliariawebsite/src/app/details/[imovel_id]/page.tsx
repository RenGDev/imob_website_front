"use client"
import { Carousel } from "@/components/Carousel";
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

import 'flowbite';

export default function Detalhes() {
  const params = useParams()

  const id = params.imovel_id

  const [imoveis, setImoveis] = useState<ImovelItf>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list/${id}`)
      console.log(response)
      const dados = await response.json()
      // console.log(dados)
      setImoveis(dados)
    }
    buscaDados()
  }, [])


  return (
    <>
      <section className="bg-white border border-gray-200 rounded-lg shadow md:w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">

        {imoveis?.photo &&
          <>
            <Carousel key={imoveis.id} imovel={imoveis}/>
          </>
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
            </div>
            
            <div className="grid grid-cols-3 text-gray-500 text-[1.1rem]">
              <h2 className="inline-flex gap-2"><img src="/size.png" alt="" className="h-6"/> {imoveis?.size} m²</h2>
              <h2 className="inline-flex gap-2 ml-[-10rem]"><img src="/quarto.png" alt="" className="h-6"/> {imoveis?.bedRooms}</h2>
              <h2 className="inline-flex gap-2 ml-[-20rem]"><img src="/8665909_shower_bathroom_icon.png" alt="" className="h-6"/> {imoveis?.bathRooms}</h2>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
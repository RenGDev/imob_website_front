'use client'
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useEffect, useState } from "react";
import { CardImovel } from "@/components/CardImovel";
import { InputPesquisa } from "@/components/InputPesq";
import { useUserStore } from "@/context/UserContext";
export default function Home() {
	const [imoveis, setImoveis] = useState<ImovelItf[]>([])
    const { signInUser } = useUserStore()

  // useEffect (efeito colateral): executa algo quando o componente
  // é renderizado (no caso, quando [])
  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list`)
      const dados = await response.json()
      // console.log(dados)
      setImoveis(dados)
    }

    buscaDados()

    async function searchUser(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/list/${id}`)
        const dados = await response.json()
        
        signInUser(dados)
      }
      if (localStorage.getItem("clienteKey")) {
        const idCliente = localStorage.getItem("clienteKey")
        searchUser(idCliente as string)
      }
  }, [])

  const listImovel = imoveis.map( imovel =>(
    <CardImovel key={imovel.id} data={imovel} />
  ))

  return (
    <>
      <main>
          <div className="text-center">
            <h1 className="text-4xl text-chart-4 font-bold mt-28">Imóveis à venda</h1>
            <p className="text-gray-400">Os melhores imoveis aqui</p>
				<hr className="border-accent-foreground w-1/12 mx-auto mt-2" />
            <svg className="w-10 h-10 text-gray-800 dark:text-white mx-auto mt-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  				<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
			</svg>

            <InputPesquisa setImoveis={setImoveis}/>
				
          </div>
		    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-50 pb-16 mt-14">
                {listImovel}
			</div>
      </main>
    </>
  );
}

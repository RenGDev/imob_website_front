'use client'
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useEffect, useState } from "react";
import { CardImovel } from "@/components/CardImovel";
import { useAuthStore } from "@/context/UserContext";
export default function Home() {
	const [imoveis, setImoveis] = useState<ImovelItf[]>([])
	const { Logged } = useAuthStore()

	// useEffect (efeito colateral): executa algo quando o componente
	// é renderizado (no caso, quando [])
	useEffect(() => {
		async function buscaDados() {
			const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list`)
			const dados = await response.json()
			setImoveis(dados)
		}

		buscaDados()

		async function searchUser(id: string) {
				const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/list/${id}`)
				const dados = await response.json()
				Logged(dados)
			}
			if (localStorage.getItem("clienteKey")) {
				const idCliente = localStorage.getItem("clienteKey")
				searchUser(idCliente as string)
			}

	}, [])

	const imoveisVenda = imoveis.filter(imovel => imovel.priceType === "Venda")
	const imoveisAluguel = imoveis.filter(imovel => imovel.priceType === "Aluguel")

	const listImovelVenda = imoveisVenda.map(imovel => (
	  <CardImovel key={imovel.id} data={imovel} />
	))

	const listImovelAluguel = imoveisAluguel.map(imovel => (
	  <CardImovel key={imovel.id} data={imovel} />
	))

	return (
		<>
			<main>
				<section className="h-dvh flex flex-col md:relative bg-amber-300">
						<p className="text-white md:absolute left-48 top-40 w-5/12 rounded-lg text-6xl text-center">Seu proximo imovel na palma da sua mão</p>
						<img className="h-11/12 md:absolute right-1 bottom-0 " src="/download.png" alt="" />
				</section>
				<section>
					<div className="text-center">
						<h1 className="text-4xl text-amber-300 font-bold mt-28">Imóveis Disponiveis</h1>
						<p className="text-gray-300">Os melhores imoveis aqui</p>
						<hr className="w-1/12 mx-auto mt-2 border-amber-200" />
						<hr className="w-[7%] mx-auto mt-2 border-amber-200" />
						<svg className="w-10 h-10 text-gray-800 dark:text-white mx-auto mt-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
						</svg>
					</div>
					<div className="px-25 pb-16 text-purple-500">
						<h1 className="text-3xl">À venda</h1>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 mt-10">
							{listImovelVenda}
						</div>
					</div>
					
					<div className="px-25 pb-16 text-purple-500">
						<h1 className="text-3xl">Para alugar</h1>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3  mt-10">
							{listImovelAluguel}
						</div>
					</div>			
				</section>			
			</main>
		</>
	);
}

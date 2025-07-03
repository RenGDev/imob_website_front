'use client'
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useEffect, useState } from "react";
import { CardImovel } from "@/components/CardImovel";
import { useAuthStore } from "@/context/UserContext";
import Link from "next/link";

export default function Home() {
    const [imoveis, setImoveis] = useState<ImovelItf[]>([])
    const { Logged } = useAuthStore()

    useEffect(() => {
        async function buscaDados() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list`)
                if (!response.ok) throw new Error("Erro ao carregar imóveis")
                const dados = await response.json()
                setImoveis(dados)
            } catch (error) {
                console.error("Erro ao buscar imóveis:", error)
            }
        }

        async function searchUser(id: string) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/list/id/${id}`)
                if (!response.ok) throw new Error("Erro ao carregar usuário")
                const dados = await response.json()
                Logged(dados)
            } catch (error) {
                console.error("Erro ao buscar usuário:", error)
            }
        }

        buscaDados()

        if (localStorage.getItem("clienteKey")) {
            const idCliente = localStorage.getItem("clienteKey")
            searchUser(idCliente as string)
        }
    }, [])

    // Pegar apenas os 3 primeiros imóveis de cada tipo
    const imoveisVenda = imoveis
        .filter(imovel => imovel.priceType === "Venda")
        .slice(0, 3)

    const imoveisAluguel = imoveis
        .filter(imovel => imovel.priceType === "Aluguel")
        .slice(0, 3) 

    const listImovelVenda = imoveisVenda.map(imovel => (
        <CardImovel key={imovel.id} data={imovel} />
    ))

    const listImovelAluguel = imoveisAluguel.map(imovel => (
        <CardImovel key={imovel.id} data={imovel} />
    ))

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-amber-300 px-4 md:px-8 lg:px-16 relative overflow-hidden">
                <div className="z-10 text-center md:text-left md:w-1/2 py-16 md:py-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Seu próximo imóvel na palma da sua mão
                    </h1>
                    <p className="text-xl text-white opacity-90">
                        Encontre a casa dos seus sonhos com facilidade
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
                    <img 
                        src="/download.png" 
                        alt="Imóvel dos sonhos" 
                        className="max-h-[70vh] object-contain md:absolute md:right-0 md:bottom-0"
                        loading="lazy"
                    />
                </div>
            </section>

            {/* Available Properties Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-4">
                        Imóveis em Destaque
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Confira nossos melhores imóveis
                    </p>
                    <div className="flex flex-col items-center">
                        <hr className="w-16 border-amber-400 border-t-2 mb-1" />
                        <hr className="w-12 border-amber-400 border-t-2" />
                    </div>
                    <svg 
                        className="w-10 h-10 text-gray-400 mx-auto mt-8 animate-bounce" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
                    </svg>
                </div>

                {/* Properties for Sale */}
                <div className="mb-20">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-purple-600">
                            À venda
                        </h3>
                        {imoveisVenda.length > 0 && (
                            <Link 
                                href="/todos?tipo=Venda" 
                                className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
                            >
                                Ver todos →
                            </Link>
                        )}
                    </div>
                    {imoveisVenda.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listImovelVenda}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">
                            Nenhum imóvel disponível para venda no momento.
                        </p>
                    )}
                </div>

                {/* Properties for Rent */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-purple-600">
                            Para alugar
                        </h3>
                        {imoveisAluguel.length > 0 && (
                            <Link 
                                href="/todos?tipo=Aluguel" 
                                className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
                            >
                                Ver todos →
                            </Link>
                        )}
                    </div>
                    {imoveisAluguel.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listImovelAluguel}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">
                            Nenhum imóvel disponível para aluguel no momento.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
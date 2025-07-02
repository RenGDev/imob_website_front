'use client'
import AllCardImovel from "@/components/AllCardImovel"
import { InputPesquisa } from "@/components/InputPesq"
import { useAuthStore } from "@/context/UserContext"
import { ImovelItf } from "@/utils/types/ImovelItf"
import { useEffect, useState } from "react"


const types = ["Apartamento", "Casa", "Cobertura", "Kitnet"]
export default function Todos(){
    const [imoveis, setImoveis] = useState<ImovelItf[]>([])
    const [filtroTipo, setFiltroTipo] = useState<string[]>([])
    const { Logged } = useAuthStore()

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

    function handleFiltroChange(tipo: string) {
        setFiltroTipo(prev => 
            prev.includes(tipo)
                ? prev.filter(t => t !== tipo)
                : [...prev, tipo] 
        )
    }

    const imoveisFiltrados = filtroTipo.length === 0
        ? imoveis 
        : imoveis.filter(imovel => filtroTipo.includes(imovel.type))
    
    const listImovel = imoveisFiltrados.map(imovel => (
        <AllCardImovel key={imovel.id} data={imovel} />
    ))

    const checkboxList = types.map(type => (
        <p className="flex items-center gap-2">
            <input 
                type="checkbox" 
                name={type} id={type} 
                checked={filtroTipo.includes(`${type}`)}
                onChange={() => handleFiltroChange(`${type}`)} 
            />
            <label htmlFor={type}>{type}</label>
        </p>
    ))

    return(
        <main className="flex items-start justify-between gap-3 p-10 w-full">
            <section className="w-[30%] sticky shadow-accent border-gray-400 mt-10 flex flex-col gap-4">
                <h2>Tipo de imovel</h2>
                <div className="flex flex-col gap-2 ml-5">
                    {checkboxList}
                </div>
                <hr className="bg-gray-400 w-[70%]"/>
            </section>
            <section className="flex flex-col w-[70%] gap-2">
                <InputPesquisa setImoveis={setImoveis}/>
                <h1 className="text-2xl">Imoveis a venda</h1>
                <div className="flex flex-col gap-6">
                    {listImovel}
                </div>
                
            </section>
            
        </main>
    )
}
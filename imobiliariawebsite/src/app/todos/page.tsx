'use client'
import AllCardImovel from "@/components/AllCardImovel"
import { InputPesquisa } from "@/components/InputPesq"
import { useAuthStore } from "@/context/UserContext"
import { ImovelItf } from "@/utils/types/ImovelItf"
import { useEffect, useState } from "react"

export default function Todos(){
    const [imoveis, setImoveis] = useState<ImovelItf[]>([])
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
    
    const listImovel = imoveis.map(imovel => (
        <AllCardImovel key={imovel.id} data={imovel} />
    ))

    return(
        <main className="flex items-end gap-3 p-10 flex-col w-full">
            <section className="flex flex-col gap-2">
                <InputPesquisa setImoveis={setImoveis}/>
                <h1 className="text-2xl">Imoveis a venda</h1>
                <div className="flex flex-col gap-6">
                    {listImovel}
                </div>
                
            </section>
            
        </main>
    )
}
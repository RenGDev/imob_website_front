'use client'
import { CardImovel } from "@/components/CardImovel"
import { useAuthStore } from "@/context/UserContext"
import { UserItf } from "@/utils/types/UserItf"
import { useEffect, useState } from "react"

export default function MyImoveis(){
    const { user, token } = useAuthStore()
    const [userImov, setUser] = useState<UserItf>()

    useEffect(() => {
        async function searchUser() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/list/id/${user?.id}`)
                if (!response.ok) throw new Error("Erro ao carregar usuário")
                const dados = await response.json()
                console.log(dados)
                setUser(dados)
            } catch (error) {
                console.error("Erro ao buscar usuário:", error)
            }
        }

        searchUser()
    }, [user?.id])
    

    const listImovel = userImov?.myImoveis.map(imovel => (
        <CardImovel key={imovel.id} data={imovel} />
    ))

    
    return(
        <main className="flex flex-col justify-center p-9 md:p-32 pt-20 gap-15">
            <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">Seus imoveis</h1>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listImovel}
            </section>
        </main>
    )
}
'use client'
import { useAuthStore } from "@/context/UserContext"
import { PropostaItf } from "@/utils/types/PropostasItf"
import { useEffect, useState } from "react"

export default function Propostas(){

    const [propostas, setPropostas] = useState<PropostaItf[]>([])
    const { user, token } = useAuthStore()

    useEffect(() => {
        async function buscaDados() {
          if (user?.id) {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user_imovel/list/${user.id}`);
              const dados = await response.json();
              setPropostas(dados);
              console.log(dados)
            } catch (err) {
              console.error("Erro ao buscar propostas:", err);
            }
          }
        }

        buscaDados();
        
    }, [user?.id]);

    async function deleteProposta(userId: number, imovelId: number) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user_imovel/delete/${userId}/${imovelId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
      
          if (!response.ok) throw new Error("Erro ao deletar");
      
          setPropostas(prev => prev.filter(p => p.id.userId !== userId || p.id.imovelId !== imovelId));
        } catch (err) {
          console.error("Erro ao deletar proposta:", err);
        }
    }

    const table = propostas.map(proposta => (
         <tr key={`${proposta.id.userId}-${proposta.id.imovelId}`} className="bg-amber-300 text-shadow-2xs border-b border-gray-200">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {proposta.imoveis.description}
            </th>
            <td className="px-6 py-4">
                {proposta.imoveis.type}
            </td>
            <td className="px-6 py-4">
                {proposta.imoveis.priceType}
            </td>
            {proposta.imoveis.priceType == "Aluguel" ?
                <td className="px-6 py-4">
                  {Number(proposta.imoveis.price).toLocaleString("pt-br", { minimumFractionDigits: 2 })} $RS/mes
                </td>

                :
                
                <td className="px-6 py-4">
                  {Number(proposta.imoveis.price).toLocaleString("pt-br", { minimumFractionDigits: 2 })} $RS
                </td>
            }
            <td className="px-6 py-4">
                <button onClick={()=> deleteProposta(proposta.id.userId, proposta.id.imovelId)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</button>
            </td>
        </tr>          
    ))

    return(
        <main className="flex flex-col gap-5">
            <h1 className="m-auto mt-8 text-3xl">Suas propostas</h1>
            <div className="relative overflow-x-auto sm:rounded-lg p-5">
                <table className="w-full shadow-md text-sm text-left rtl:text-right border-2 border-purple-500 text-gray-500 rounded-md">
                    <thead className="text-xs text-gray-700 uppercase bg-purple-500">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Descrição
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tipo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Precificação
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table}     
                    </tbody>
                </table>
            </div>
        </main>
    )
}
'use client'
import { useAuthStore } from "@/context/UserContext"
import { PropostaItf } from "@/utils/types/PropostasItf"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import LoadingSpinner from "@/components/LoadingSpinner" // Adicione um componente de loading

export default function Propostas() {
    const [propostas, setPropostas] = useState<PropostaItf[]>([])
    const [loading, setLoading] = useState(true)
    const { user, token } = useAuthStore()

    useEffect(() => {
        async function buscaDados() {
            if (!user?.id) return
            
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user_imovel/list/${user.id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                
                if (!response.ok) {
                    throw new Error("Falha ao carregar propostas")
                }
                
                const dados = await response.json()
                setPropostas(dados)
            } catch (err) {
                console.error("Erro ao buscar propostas:", err)
                toast.error("Não foi possível carregar suas propostas")
            } finally {
                setLoading(false)
            }
        }

        buscaDados()
    }, [user?.id, token])

    async function deleteProposta(userId: number, imovelId: number) {
        const confirm = window.confirm("Tem certeza que deseja cancelar esta proposta?")
        if (!confirm) return
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user_imovel/delete/${userId}/${imovelId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
        
            if (!response.ok) throw new Error("Erro ao deletar proposta")
            
            setPropostas(prev => prev.filter(p => p.id.userId !== userId || p.id.imovelId !== imovelId))
            toast.success("Proposta cancelada com sucesso")
        } catch (err) {
            console.error("Erro ao deletar proposta:", err)
            toast.error("Falha ao cancelar proposta")
        }
    }

    const formatPrice = (price: number, priceType: string) => {
        return priceType === "Aluguel" 
            ? `${price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês`
            : price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">Suas Propostas</h1>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            ) : propostas.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">Você ainda não fez nenhuma proposta</p>
                    <p className="text-gray-500 mt-2">Encontre imóveis e envie suas propostas</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-purple-600 text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Imóvel
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Tipo de Negócio
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Valor
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {propostas.map(proposta => (
                                    <tr key={`${proposta.id.userId}-${proposta.id.imovelId}`} className="hover:bg-amber-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{proposta.imoveis.description}</div>
                                            <div className="text-sm text-gray-500">{proposta.imoveis.address}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proposta.imoveis.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proposta.imoveis.priceType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatPrice(proposta.imoveis.price, proposta.imoveis.priceType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => deleteProposta(proposta.id.userId, proposta.id.imovelId)}
                                                className="text-red-600 hover:text-red-900 mr-4 transition-colors"
                                                title="Cancelar proposta"
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    )
}
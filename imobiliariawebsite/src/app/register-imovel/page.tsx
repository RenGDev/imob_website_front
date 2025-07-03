'use client'
import { useAuthStore } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Inputs = {
    description: string
    address: string
    type: string
    priceType: string
    price: number
    bedRooms: number
    bathRooms: number
    parkingSpace: number
    size: number
}

export default function Register_Imovel() {
    const { user, token } = useAuthStore()
    const { register, handleSubmit, reset } = useForm<Inputs>()
    const router = useRouter()
    
    async function registrar(data: Inputs) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/register`, {
            headers: { 
                "Content-Type": "application/json",  
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify(data),
        })

        if (response.status == 200) {
            toast.success("Imóvel registrado com sucesso")
            reset()
        } else {
            toast.error("Erro... Não foi possível realizar o cadastro")
        }
    }

    return (
        <main>  
            {user ? (
                <main className="flex items-center justify-center bg-amber-300 w-full min-h-dvh py-8 px-4">
                    <div className="flex flex-col gap-6 bg-amber-400 p-6 rounded-md w-full max-w-4xl mx-4">
                        <h1 className="text-center text-purple-600 text-2xl font-bold">Cadastre seu imóvel</h1>
                        <form className="flex flex-col gap-4 text-purple-600" onSubmit={handleSubmit(registrar)}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="description">Descrição</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="text" 
                                        id="input_description" 
                                        required 
                                        {...register("description")}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="address">Endereço (Cidade/Endereço)</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="text" 
                                        id="input_address" 
                                        required 
                                        {...register("address")}
                                    />
                                </div>
                            </div>

                            {/* Linha 2 - Tipo e Tipo de Preço */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="type">Tipo de imóvel (Apartamento/Casa/Kitnet)</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="text" 
                                        id="input_type" 
                                        required 
                                        {...register("type")}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="priceType">Precificação do imóvel (Aluguel/Venda)</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="text"  
                                        id="input_priceType" 
                                        required 
                                        {...register("priceType")}
                                    />
                                </div>
                            </div>

                            {/* Linha 3 - Preço e Quartos */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="price">Preço</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="number" 
                                        id="input_price" 
                                        required 
                                        {...register("price")}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="bedRooms">Quantidade de Quartos</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="number" 
                                        id="input_bedRooms" 
                                        required 
                                        {...register("bedRooms")}
                                    />
                                </div>
                            </div>

                            {/* Linha 4 - Banheiros e Vagas */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="bathRooms">Quantidade de Banheiros</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="number" 
                                        id="input_bathRooms" 
                                        required 
                                        {...register("bathRooms")}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-sm font-medium" htmlFor="parkingSpace">Quantidade de Vagas</label>
                                    <input 
                                        className="w-full rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                        type="number" 
                                        id="input_parkingSpace" 
                                        required 
                                        {...register("parkingSpace")}
                                    />
                                </div>
                            </div>

                            {/* Linha 5 - Tamanho */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium" htmlFor="size">Tamanho (m²)</label>
                                <input 
                                    className="w-2/4 rounded-md p-2 border border-amber-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                    type="number" 
                                    id="input_size" 
                                    required 
                                    {...register("size")}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-600 mt-2 hover:bg-amber-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                            >
                                Cadastrar
                            </button>
                        </form>
                    </div>
                </main>
            ) : (
                <main className="flex items-center justify-center min-h-dvh bg-amber-300 p-4">
                    <div className="bg-amber-400 p-6 rounded-md text-center">
                        <p className="text-purple-600 font-medium">
                            Faça login para cadastrar um imóvel
                        </p>
                    </div>
                </main>
            )}
        </main>
    )
}
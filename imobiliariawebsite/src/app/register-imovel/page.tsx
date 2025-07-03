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
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>()
    const router = useRouter()
    
    async function registrar(data: Inputs) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/register`, {
                headers: { 
                    "Content-Type": "application/json",  
                    "Authorization": `Bearer ${token}`
                },
                method: "POST",
                body: JSON.stringify(data),
            })

            if (response.status == 200) {
                toast.success("Imóvel registrado com sucesso!")
                reset()
            } else {
                const errorData = await response.json()
                toast.error(errorData.message || "Erro ao cadastrar imóvel")
            }
        } catch (error) {
            toast.error("Erro de conexão com o servidor")
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">  
            {user ? (
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Sidebar ilustrativa */}
                            <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-purple-600 to-amber-500 p-8 text-white">
                                <div className="h-full flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Cadastre seu imóvel</h2>
                                        <p className="text-purple-100 opacity-90">
                                            Preencha os detalhes do seu imóvel para começar a atrair compradores ou locatários.
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold mr-3">1</div>
                                            <span>Informações básicas</span>
                                        </div>
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold mr-3">2</div>
                                            <span>Detalhes do imóvel</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold mr-3">3</div>
                                            <span>Valores e finalização</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Formulário */}
                            <div className="md:w-2/3 p-8">
                                <div className="md:hidden mb-6">
                                    <h1 className="text-2xl font-bold text-purple-700">Cadastre seu imóvel</h1>
                                    <p className="text-gray-600 mt-2">Preencha todos os campos obrigatórios</p>
                                </div>
                                
                                <form onSubmit={handleSubmit(registrar)} className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-purple-700 mb-4 border-b pb-2">Informações básicas</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição*</label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.description ? 'border-red-500' : 'border'}`}
                                                    {...register("description", { required: true })}
                                                />
                                                {errors.description && <p className="mt-1 text-sm text-red-600">Este campo é obrigatório</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço completo*</label>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.address ? 'border-red-500' : 'border'}`}
                                                    {...register("address", { required: true })}
                                                />
                                                {errors.address && <p className="mt-1 text-sm text-red-600">Este campo é obrigatório</p>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-medium text-purple-700 mb-4 border-b pb-2">Tipo e preço</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de imóvel*</label>
                                                <select
                                                    id="type"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.type ? 'border-red-500' : 'border'}`}
                                                    {...register("type", { required: true })}
                                                >
                                                    <option value="">Selecione...</option>
                                                    <option value="Apartamento">Apartamento</option>
                                                    <option value="Casa">Casa</option>
                                                    <option value="Kitnet">Kitnet</option>
                                                    <option value="Sobrado">Cobertura</option>
                                                </select>
                                                {errors.type && <p className="mt-1 text-sm text-red-600">Este campo é obrigatório</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="priceType" className="block text-sm font-medium text-gray-700">Tipo de negócio*</label>
                                                <select
                                                    id="priceType"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.priceType ? 'border-red-500' : 'border'}`}
                                                    {...register("priceType", { required: true })}
                                                >
                                                    <option value="">Selecione...</option>
                                                    <option value="Aluguel">Aluguel</option>
                                                    <option value="Venda">Venda</option>
                                                </select>
                                                {errors.priceType && <p className="mt-1 text-sm text-red-600">Este campo é obrigatório</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço*</label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">R$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        id="price"
                                                        step="0.01"
                                                        min="0"
                                                        className={`block w-full pl-10 pr-12 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.price ? 'border-red-500' : 'border'}`}
                                                        {...register("price", { required: true, min: 0 })}
                                                    />
                                                </div>
                                                {errors.price && <p className="mt-1 text-sm text-red-600">Valor inválido</p>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-medium text-purple-700 mb-4 border-b pb-2">Detalhes do imóvel</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="bedRooms" className="block text-sm font-medium text-gray-700">Quartos*</label>
                                                <input
                                                    type="number"
                                                    id="bedRooms"
                                                    min="0"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.bedRooms ? 'border-red-500' : 'border'}`}
                                                    {...register("bedRooms", { required: true, min: 0 })}
                                                />
                                                {errors.bedRooms && <p className="mt-1 text-sm text-red-600">Valor inválido</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="bathRooms" className="block text-sm font-medium text-gray-700">Banheiros*</label>
                                                <input
                                                    type="number"
                                                    id="bathRooms"
                                                    min="0"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.bathRooms ? 'border-red-500' : 'border'}`}
                                                    {...register("bathRooms", { required: true, min: 0 })}
                                                />
                                                {errors.bathRooms && <p className="mt-1 text-sm text-red-600">Valor inválido</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="parkingSpace" className="block text-sm font-medium text-gray-700">Vagas de garagem*</label>
                                                <input
                                                    type="number"
                                                    id="parkingSpace"
                                                    min="0"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.parkingSpace ? 'border-red-500' : 'border'}`}
                                                    {...register("parkingSpace", { required: true, min: 0 })}
                                                />
                                                {errors.parkingSpace && <p className="mt-1 text-sm text-red-600">Valor inválido</p>}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="size" className="block text-sm font-medium text-gray-700">Área (m²)*</label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <input
                                                        type="number"
                                                        id="size"
                                                        min="0"
                                                        step="0.01"
                                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.size ? 'border-red-500' : 'border'}`}
                                                        {...register("size", { required: true, min: 0 })}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">m²</span>
                                                    </div>
                                                </div>
                                                {errors.size && <p className="mt-1 text-sm text-red-600">Valor inválido</p>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => reset()}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                        >
                                            Limpar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                        >
                                            Cadastrar Imóvel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="mt-3 text-lg font-medium text-gray-900">Acesso restrito</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Você precisa estar logado para cadastrar um imóvel.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Fazer login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
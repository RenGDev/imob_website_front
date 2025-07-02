'use client'
import { useAuthStore } from "@/context/UserContext"
import { main } from "flowbite-react/cli/main"
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
    parkingSpace:number
    size: number
}

export default function Register_Imovel(){
    const { user, token } = useAuthStore()
    const { register, handleSubmit, reset } = useForm<Inputs>()
    const router = useRouter()
    
    async function registrar(data: Inputs) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/register`, {
      headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}`},
      method: "POST",
      body: JSON.stringify(data),
    })

    if (response.status == 200) {
      toast.success("Imovel registrado com sucesso")
      reset()
    } else {
      toast.error("Erro... Não foi possível realizar o cadastro")
    }
  }
    return(
        <main>  
            {user ?
                (
                    <main className="flex items-center justify-center bg-amber-300 w-full h-dvh">
                        <div className="flex flex-col gap-11 bg-amber-400 p-7 rounded-md">
                            <h1 className="text-center text-purple-600 text-2xl">Cadastre seu imovel</h1>
                            <form className="flex flex-col gap-3 text-purple-600" onSubmit={handleSubmit(registrar)}>
                                <div className="flex gap-2">
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="description">Descrição</label>
                                        <input className="w-64 rounded-md" type="text" id="input_description" required {...register("description")}/>
                                    </p>
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="address">Endereço(Cidade/Endereço)</label>
                                        <input className="w-64 rounded-md" type="text" id="input_address" required {...register("address")}/>
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="type">Tipo de imovel(Apartamento/Casa/Kitnet)</label>
                                        <input className="w-64 rounded-md" type="text" id="input_type" required {...register("type")}/>
                                    </p>
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="priceType">Precificção do imovel(Aluguel/Venda)</label>
                                        <input className="w-64 rounded-md" type="text"  id="input_priceType" required {...register("priceType")}/>
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="price">Preço</label>
                                        <input className="w-64 rounded-md" type="number" id="input_price" required {...register("price")}/>
                                    </p>
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="bedRooms">Quantidade de Quartos</label>
                                        <input className="w-64 rounded-md" type="number" id="input_bedRooms" required {...register("bedRooms")}/>
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="bathRooms">Quantidade de Banheiros</label>
                                        <input className="w-64 rounded-md" type="number" id="input_bathRooms" required {...register("bathRooms")}/>
                                    </p>
                                    <p className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="parkingSpace">Quantidade de Vagas</label>
                                        <input className="w-64 rounded-md" type="number" id="input_parkingSpace" required {...register("parkingSpace")}/>
                                    </p>
                                </div>

                                <p className="flex flex-col gap-1">
                                    <label className="text-sm" htmlFor="size">Tamanho (m²)</label>
                                    <input className="w-64 rounded-md" type="number" id="input_size" required {...register("size")}/>
                                </p>

                                <button
                                type="submit"
                                className="w-full bg-amber-600 mt-2 hover:bg-amber-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                Cadastrar
                                </button>
                            </form>
                        </div>
                    </main>

                ):(
                    <main>
                        Faça Login para cadastrar um imovel
                    </main>
                )     
            }
         </main>
        
    )
}
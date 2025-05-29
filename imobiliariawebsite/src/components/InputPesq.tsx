import { ImovelItf } from "@/utils/types/ImovelItf";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import "flowbite"

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setImoveis: React.Dispatch<React.SetStateAction<ImovelItf[]>>
}

export function InputPesquisa({ setImoveis }: InputPesquisaProps) {
    const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {
        // alert(data.termo)
        if (data.termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/pesq?type=${data.termo}`)
        const dados = await response.json()

        if (dados.length == 0) {
            toast.error("Não há veículos para a pesquisa informada")
            setFocus("termo")
            reset({ termo: "" })
            return
        }

        // console.log(dados)
        setImoveis(dados)
    }

    async function mostraDestaques() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list`)
        const dados = await response.json()
        reset({ termo: "" })
        setImoveis(dados)
    }

    return (
        <div className="flex mx-auto max-w-4xl mt-5">
            <form className="flex-1 max-w-3xl" onSubmit={handleSubmit(enviaPesquisa)}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative ml-10 md:ml-0">
                    <input type="search" id="default-search" className="block w-7/12 md:w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Tipo de residencia" required
                        {...register("termo")} />
                    <button type="submit" className="cursor-pointer text-white absolute end-14 md:end-16 bottom-2.5 bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </button>
                    <button type="button"
                        className="cursor-pointer text-white absolute end-14 md:end-2.5 bottom-2.5 bg-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-blue-800"
                        onClick={mostraDestaques}>
                        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}
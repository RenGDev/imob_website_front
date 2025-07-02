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
        <div className="flex mt-5 mb-10">
            <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative ml-10 md:ml-0">
                    <input type="search" id="default-search" className="block w-3xl p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Tipo de residencia" required
                        {...register("termo")}
                        onKeyDown={(e) => {
                            if (e.key == 'enter'){
                                handleSubmit(enviaPesquisa)
                            }}}
                    />
                    <button type="button"
                        className="cursor-pointer text-white absolute end-14 md:end-13 bottom-2.5 bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                        onClick={mostraDestaques}>
                        Todos
                    </button>
                </div>
            </form>
        </div>
    )
}
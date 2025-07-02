import { ImovelItf } from "@/utils/types/ImovelItf";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
    termo: string;
};

type InputPesquisaProps = {
    setImoveis: React.Dispatch<React.SetStateAction<ImovelItf[]>>;
};

export function InputPesquisa({ setImoveis }: InputPesquisaProps) {
    const { register, handleSubmit, reset, setFocus } = useForm<Inputs>();

    async function enviaPesquisa(data: Inputs) {
        const termoLimpo = data.termo.trim();

        if (termoLimpo.length < 2) {
            toast.error("Digite pelo menos 2 letras para pesquisar.");
            setFocus("termo");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/pesq?type=${termoLimpo}`);
            const dados = await response.json();

            if (!dados || dados.length === 0) {
                toast.error("Nenhum imóvel encontrado para o tipo informado.");
                reset({ termo: "" });
                setFocus("termo");
                return;
            }

            setImoveis(dados);
        } catch (error) {
            console.error("Erro na pesquisa:", error);
            toast.error("Erro ao realizar a pesquisa.");
        }
    }

    async function mostraDestaques() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list`);
            const dados = await response.json();
            reset({ termo: "" });
            setImoveis(dados);
        } catch (error) {
            console.error("Erro ao buscar imóveis:", error);
            toast.error("Erro ao buscar todos os imóveis.");
        }
    }

    return (
        <form onSubmit={handleSubmit(enviaPesquisa)} className="w-full mb-7 flex px-4">
            <div className="relative w-full max-w-3xl">
                <input
                    type="search"
                    id="pesquisa"
                    className="block w-full p-4 pl-5 pr-32 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Digite o tipo do imóvel (ex: Casa, Apartamento...)"
                    {...register("termo")}
                    aria-label="Campo de pesquisa por tipo de imóvel"
                />
                <div className="absolute right-2 bottom-2 flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-amber-400 hover:bg-amber-500 rounded-lg"
                    >
                        Pesquisar
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-400 hover:bg-gray-500 rounded-lg"
                        onClick={mostraDestaques}
                    >
                        Todos
                    </button>
                </div>
            </div>
        </form>
    );
}

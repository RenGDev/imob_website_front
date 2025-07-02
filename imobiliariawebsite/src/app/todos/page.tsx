'use client'
import AllCardImovel from "@/components/AllCardImovel";
import { InputPesquisa } from "@/components/InputPesq";
import { useAuthStore } from "@/context/UserContext";
import { ImovelItf } from "@/utils/types/ImovelItf";
import { useEffect, useState } from "react";

const types = ["Apartamento", "Casa", "Cobertura", "Kitnet"];

export default function Todos() {
    const [imoveis, setImoveis] = useState<ImovelItf[]>([]);
    const [filtroTipo, setFiltroTipo] = useState<string[]>([]);
    const { Logged } = useAuthStore();

    useEffect(() => {
        async function buscaDados() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/list`);
            const dados = await response.json();
            setImoveis(dados);
        }

        buscaDados();

        const idCliente = localStorage.getItem("clienteKey");
        if (idCliente) {
            fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/list/${idCliente}`)
                .then(res => res.json())
                .then(dados => Logged(dados));
        }
    }, []);

    function handleFiltroChange(tipo: string) {
        setFiltroTipo(prev =>
            prev.includes(tipo)
                ? prev.filter(t => t !== tipo)
                : [...prev, tipo]
        );
    }

    const imoveisFiltrados = filtroTipo.length === 0
        ? imoveis
        : imoveis.filter(imovel => filtroTipo.includes(imovel.type));

    return (
        <main className="w-full px-4 md:px-10 py-6">
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* Filtros - 30% no desktop */}
                <aside className="w-full md:w-[30%] md:max-w-[300px] border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Tipo de imóvel</h2>
                    <div className="flex flex-col gap-2 ml-2">
                        {types.map(type => (
                            <label key={type} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filtroTipo.includes(type)}
                                    onChange={() => handleFiltroChange(type)}
                                    className="accent-amber-500"
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                    <hr className="my-4 border-gray-300 w-[70%]" />
                </aside>

                {/* Conteúdo - 70% no desktop */}
                <section className="w-full md:w-[70%] flex flex-col gap-4">
                    <InputPesquisa setImoveis={setImoveis} />
                    <h1 className="text-2xl font-bold">Imóveis à venda</h1>

                    {imoveisFiltrados.length === 0 ? (
                        <p className="text-gray-500">Nenhum imóvel encontrado com os filtros atuais.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {imoveisFiltrados.map(imovel => (
                                <AllCardImovel key={imovel.id} data={imovel} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

'use client'
import { useAuthStore } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel, VictoryTheme, VictoryChart, VictoryAxis, VictoryBar } from "victory";

interface Estatisticas {
  totalUsuarios: number;
  totalImoveis: number;
}

interface GraficoItem {
  nome: string;
  num: number;
}

export default function Principal() {
  const { token } = useAuthStore()
  const [isClient, setIsClient] = useState(false);
  
  const [dados, setDados] = useState<Estatisticas>({
    totalUsuarios: 0,
    totalImoveis: 0
  });

  const [imoveisPorTipo, setImoveisPorTipo] = useState<GraficoItem[]>([]);

  useEffect(() => {

    if (!token) return; 

    setIsClient(true);
    
    async function fetchDados() {
      try {
        const [estatisticasRes, tipoRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/estatisticas`, 
            {  headers: {
              Authorization: `Bearer ${token}`
            } }),
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/imoveisByType`, 
            {  headers: {
              Authorization: `Bearer ${token}`
            } }),
        ]);


        const estatisticas = await estatisticasRes.json();
        const byType = await tipoRes.json();

        setDados(estatisticas);
        setImoveisPorTipo(byType);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    }

    fetchDados();
  }, [token]);

  const dataTipo = imoveisPorTipo.map(item => ({ x: item.nome, y: item.num }));

  return (
    <div className="container mt-24">
      <h2 className="text-3xl font-bold mb-8 text-center">Visão Geral do Sistema</h2>

      {/* Totais */}
      <div className="flex justify-center gap-6 mx-auto w-full max-w-4xl mb-10">
        <div className="border border-blue-600 rounded p-6 w-1/2">
          <span className="block text-3xl font-bold text-blue-800 text-center bg-blue-100 rounded py-4">
            {dados.totalUsuarios}
          </span>
          <p className="mt-2 text-center font-semibold">Total de Usuários</p>
        </div>

        <div className="border border-green-600 rounded p-6 w-1/2">
          <span className="block text-3xl font-bold text-green-800 text-center bg-green-100 rounded py-4">
            {dados.totalImoveis}
          </span>
          <p className="mt-2 text-center font-semibold">Total de Imóveis</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="flex justify-center flex-wrap gap-10">

        

        {isClient && (
        <div className="flex flex-wrap justify-center gap-12">
          <VictoryChart
            domainPadding={20}
            width={500}
            height={400}
            theme={VictoryTheme.clean}
          >
            <VictoryAxis
              style={{ tickLabels: { angle: 360, fontSize: 10 } }}
            />
            <VictoryAxis dependentAxis tickFormat={(x) => String(x)} />
            <VictoryBar
              data={dataTipo}
              x="x"
              y="y"
              labels={({ datum }) => `${datum.y}`}
              style={{
                data: { fill: "#3b82f6" },
                labels: { fontSize: 8 },
              }}
            />
          </VictoryChart>
        </div>
      )}
        
      </div>c 
    </div>
  );
}

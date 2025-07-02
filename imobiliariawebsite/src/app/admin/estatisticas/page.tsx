'use client'
import { useAuthStore } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { VictoryPie, VictoryTheme, VictoryChart, VictoryAxis, VictoryBar } from "victory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

interface Estatisticas {
  totalUsuarios: number;
  totalImoveis: number;
}

interface GraficoItem {
  nome: string;
  num: number;
}

export default function Estatisticas() {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [dados, setDados] = useState<Estatisticas>({
    totalUsuarios: 0,
    totalImoveis: 0
  });

  const [imoveisPorTipo, setImoveisPorTipo] = useState<GraficoItem[]>([]);

  useEffect(() => {
    if (!token) {
      setError(true);
      return;
    }

    async function fetchDados() {
      setLoading(true);
      setError(false);
      
      try {
        const [estatisticasRes, tipoRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/estatisticas`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/imoveisByType`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (!estatisticasRes.ok || !tipoRes.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const estatisticas = await estatisticasRes.json();
        const byType = await tipoRes.json();

        setDados(estatisticas);
        setImoveisPorTipo(byType);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(true);
        toast.error("Falha ao carregar estatísticas");
      } finally {
        setLoading(false);
      }
    }

    fetchDados();
  }, [token]);

  const dataTipo = imoveisPorTipo.map(item => ({ 
    x: item.nome, 
    y: item.num,
    label: `${item.nome}\n${item.num}`
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Carregando estatísticas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar dados</h2>
        <p className="text-gray-600">Verifique sua conexão ou tente novamente mais tarde</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Visão Geral do Sistema</h2>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="text-center">
            <span className="block text-4xl font-bold text-blue-600 mb-2">
              {dados.totalUsuarios.toLocaleString()}
            </span>
            <p className="text-lg font-semibold text-gray-700">Total de Usuários</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="text-center">
            <span className="block text-4xl font-bold text-green-600 mb-2">
              {dados.totalImoveis.toLocaleString()}
            </span>
            <p className="text-lg font-semibold text-gray-700">Total de Imóveis</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">
          Distribuição de Imóveis por Tipo
        </h3>
        
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[300px]">
            <VictoryChart
              domainPadding={30}
              width={600}
              height={400}
              theme={VictoryTheme.material}
              padding={{ top: 40, bottom: 80, left: 60, right: 40 }}
            >
              <VictoryAxis
                style={{ 
                  tickLabels: { 
                    angle: -45,
                    fontSize: 10,
                    padding: 10
                  },
                  axis: { stroke: "transparent" }
                }}
              />
              <VictoryAxis 
                dependentAxis 
                tickFormat={(x) => Number(x) === x ? String(x) : ""}
                style={{
                  grid: { stroke: "rgba(0,0,0,0.1)" },
                  tickLabels: { fontSize: 10 }
                }}
              />
              <VictoryBar
                data={dataTipo}
                style={{
                  data: { 
                    fill: (props: { index?: string | number }) => {
                      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                      // Converte para número seguro
                      const numIndex = typeof props.index === 'number' 
                        ? props.index 
                        : typeof props.index === 'string'
                          ? parseInt(props.index, 10) || 0
                          : 0;
                      return colors[Math.abs(numIndex) % colors.length];
                    },
                    width: 30
                  }
                }}
                labels={({ datum }) => datum.y}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
            </VictoryChart>
          </div>
        </div>
      </div>

      {/* Gráfico de Pizza (opcional) */}
      {imoveisPorTipo.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">
            Percentual por Tipo de Imóvel
          </h3>
          <div className="flex justify-center">
            <div style={{ maxWidth: "500px" }}>
              <VictoryPie
                data={dataTipo}
                colorScale={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
                innerRadius={80}
                labelRadius={({ innerRadius }) => (innerRadius as number) + 30}
                labels={({ datum }) => `${datum.x}: ${datum.y}`}
                style={{
                  labels: { 
                    fontSize: 10,
                    fill: "#4b5563"
                  }
                }}
                animate={{
                  duration: 1000
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
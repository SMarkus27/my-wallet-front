import { useEffect, useState } from "react"
import { ResponsivePie } from "@nivo/pie"

interface ChartDataItem {
    id: string
    label: string
    value: number
}

interface IdealChartProps {
    data: ChartDataItem[]
}

const IdealChart = ({ data }: IdealChartProps) => (
    <div style={{ height: 300 }}>
        <h3 className="text-lg font-semibold mb-2">Alocação Ideal</h3>
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "paired" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#fff"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            theme={{
                textColor: "#fff",
                tooltip: {
                    container: {
                        background: "#222",
                        color: "#fff",
                    },
                },
            }}
        />
    </div>
)

interface RealChartProps {
    data: ChartDataItem[]
}

const RealChart = ({ data }: RealChartProps) => {
    data = data.filter(item => item.id !== "undefined")

        return (
            <div style={{ height: 300 }}>
                <h3 className="text-lg font-semibold mb-2">Alocação Real</h3>
                <ResponsivePie
                    data={data}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: "category10" }}
                    borderWidth={1}
                    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#fff"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    theme={{
                        textColor: "#fff",
                        tooltip: {
                            container: {
                                background: "#222",
                                color: "#fff",
                            },
                        },
                    }}
                />
            </div>
            )

}

interface IdealRealChartProps {}

export const IdealRealChart = ({}: IdealRealChartProps) => {
    const [idealData, setIdealData] = useState<ChartDataItem[] | null>(null)
    const [realData, setRealData] = useState<ChartDataItem[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const VITE_ASSETS_URL = import.meta.env.VITE_ASSETS_URL;
    const VITE_ASSETS_CLASS_URL = import.meta.env.VITE_ASSETS_CLASS_URL;

    useEffect(() => {
        async function fetchData() {
            try {
                const [idealRes, realRes] = await Promise.all([
                    fetch(VITE_ASSETS_CLASS_URL, {
                        credentials: "include",

                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.data && data.data.result) {
                                const formatted = data.data.result.map(item => ({
                                    id: item.name,
                                    label: item.name,
                                    value: item.percentage,
                                }))
                                setIdealData(formatted)
                            } else {
                                console.error("Formato inesperado:", data)
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao buscar setores:", error)
                        }),
                    fetch(VITE_ASSETS_URL, {
                        credentials: "include",

                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.data && data.data.result) {
                                const grouped = data.data.result.reduce((acc: Record<string, number>, item: any) => {
                                    if (!acc[item.type]) {
                                        acc[item.type] = 0
                                    }
                                    acc[item.type] += item.percentage
                                    return acc
                                }, {})

                                if (Object.keys(grouped) !== "undefined") {
                                    const formatted = Object.entries(grouped).map(([name, percentage]) => ({
                                        id: name,
                                        label: name,
                                        value: percentage,
                                    }))
                                    setRealData(formatted)
                                }

                            }
                        })
                        .catch(error => {
                            console.error("Erro ao buscar ativos:", error)
                        })
                ])
                setLoading(false)
            } catch (err) {
                setError((err as Error).message)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <p>Carregando gráficos...</p>
    if (error) return <p className="text-red-500">Erro: {error}</p>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {idealData && <IdealChart data={idealData} />}
            {realData && <RealChart data={realData} />}
        </div>
    )
}

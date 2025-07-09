import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

type RebalanceItem = {
    ticker: string
    preco: number
    classe: string
    saldo: number
    quantidade_atual: number
    quantidade_comprar: number
    total_gasto: number
}

export const RebalanceTable = () => {
    const [classe, setClasse] = useState("")
    const [valor, setValor] = useState("")
    const [rebalanceData, setRebalanceData] = useState<RebalanceItem[]>([])

    const handleRebalance = async () => {
        if (!valor) return toast.warning("Preencha todos os campos")
        const VITE_REBALANCE_URL = import.meta.env.VITE_REBALANCE_URL;
        let params = ""
        if (!classe) {
            params = `?amount=${valor}`
        } else {
            params = `?amount=${valor}&asset_type=${classe}`
        }

        console.log(classe)
        try {
            const res = await fetch(`${VITE_REBALANCE_URL}${params}`, {
                credentials: "include",
            })

            const data = await res.json()

            if (data && data.data && data.data.result) {
                setRebalanceData(data.data.result)
            } else {
                toast.error("Formato inesperado na resposta")
            }
        } catch (err) {
            console.error("Erro ao buscar dados de rebalanceamento:", err)
            toast.error("Erro ao buscar dados de rebalanceamento")
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Simular Rebalanceamento</h2>

            <div className="flex flex-wrap items-center gap-4">
                <Input
                    placeholder="Classe (ex: Ações)"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Valor para aportar"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />
                <Button onClick={handleRebalance}>Calcular</Button>
            </div>

            {rebalanceData.length > 0 && (
                <Table className="mt-6 border rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticker</TableHead>
                            <TableHead>Classe</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Quantidade Atual</TableHead>
                            <TableHead>Saldo Atual</TableHead>
                            <TableHead>Qtd. a Comprar</TableHead>
                            <TableHead>Total Gasto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rebalanceData.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell>{item.ticker}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>R$ {item.price}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>R$ {item.balance}</TableCell>
                                <TableCell>{item.amount_buy}</TableCell>
                                <TableCell>R$ {item.total_spent}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

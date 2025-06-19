import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useAssets } from "@/context/AssetsContext";

const AssetsTable = () => {
    const { assets, fetchAssets } = useAssets();
    const VITE_ASSETS_URL = import.meta.env.VITE_ASSETS_URL;

    useEffect(() => {
        fetchAssets();
    }, []);
    const [selectedAsset, setSelectedAsset] = useState<null | typeof assets[0]>(null);
    const [showDialog, setShowDialog] = useState(false);

    const handleEdit = (asset: typeof assets[0]) => {
        setSelectedAsset(asset);
        setShowDialog(true);
    };

    const handleDelete = async (id: string | number) => {
        const confirm = window.confirm("Deseja realmente deletar este ativo?");
        if (!confirm) return;

        try {
            const VITE_ASSETS_URL = import.meta.env.VITE_ASSETS_URL;
            await fetch(`${VITE_ASSETS_URL}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            toast.success("Ativo deletado com sucesso");
            fetchAssets();
        } catch {
            toast.error("Erro ao deletar ativo");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAsset) return;

        try {
            await fetch(`${VITE_ASSETS_URL}/${selectedAsset.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    quantity: selectedAsset.quantidade,
                }),
            });
            toast.success("Ativo atualizado com sucesso");
            setShowDialog(false);
            fetchAssets();
        } catch {
            toast.error("Erro ao atualizar ativo");
        }
    };

    const grouped = assets.reduce<Record<string, typeof assets[0][]>>((acc, asset) => {
        if (!acc[asset.classe]) acc[asset.classe] = [];
        acc[asset.classe].push(asset);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([classe, ativos]) => {
                if (classe !== "undefined") {
                    const total = ativos.reduce((acc, a) => acc + a.saldo, 0);
                    return (
                        <div key={classe} className="space-y-2">
                            <h2 className="text-lg font-semibold">
                                {classe} ({ativos.length} ativos) - Total: R$ {total.toFixed(2)}
                            </h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ticker</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Preço</TableHead>
                                        <TableHead>Saldo</TableHead>
                                        <TableHead>%</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ativos.map((a) => (
                                        <TableRow key={a.id}>
                                            <TableCell>{a.ticker}</TableCell>
                                            <TableCell>{a.quantidade}</TableCell>
                                            <TableCell>R$ {a.preco}</TableCell>
                                            <TableCell>R$ {a.saldo}</TableCell>
                                            <TableCell>{a.percentual}%</TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(a)}>
                                                    <PencilIcon className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(a.id)}>
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    );
                }
            })}

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="bg-background text-foreground">
                    <form className="space-y-4" onSubmit={handleSave}>
                        <div>
                            <Label>Ticker</Label>
                            <Input
                                value={selectedAsset?.ticker ?? ""}
                                onChange={(e) =>
                                    setSelectedAsset((prev) => prev && { ...prev, ticker: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>Quantidade</Label>
                            <Input
                                type="number"
                                onChange={(e) =>
                                    setSelectedAsset((prev) => prev && { ...prev, quantidade: Number(e.target.value) })
                                }
                            />
                        </div>
                        <div>
                            <Label>Preço</Label>
                            <Input
                                type="number"
                                value={selectedAsset?.preco ?? ""}
                                onChange={(e) =>
                                    setSelectedAsset((prev) => prev && { ...prev, preco: Number(e.target.value) })
                                }
                            />
                        </div>
                        <div>
                            <Label>Classe</Label>
                            <Input
                                value={selectedAsset?.classe ?? ""}
                                onChange={(e) =>
                                    setSelectedAsset((prev) => prev && { ...prev, classe: e.target.value })
                                }
                            />
                        </div>
                        <Button type="submit">Salvar</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssetsTable;

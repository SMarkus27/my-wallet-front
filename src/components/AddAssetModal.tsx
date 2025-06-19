import React, { useState } from "react";
import { useAssets } from "@/context/AssetsContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AddAssetButton = () => {
    const { fetchAssets } = useAssets();
    const [showDialog, setShowDialog] = useState(false);
    const [newAsset, setNewAsset] = useState({
        ticker: "",
        quantidade: 0,
        sector: "",
        classe: "",
    });
    const VITE_ASSETS_URL = import.meta.env.VITE_ASSETS_URL;

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAsset.ticker || !newAsset.classe) {
            toast.error("Preencha os campos obrigatórios");
            return;
        }

        try {
            const res = await fetch(VITE_ASSETS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ticker: newAsset.ticker,
                    quantity: newAsset.quantidade,
                    sector: newAsset.sector,
                    type: newAsset.classe,
                }),
            });

            if (res.ok) {
                toast.success("Ativo adicionado com sucesso");
                setShowDialog(false);
                setNewAsset({ ticker: "", quantidade: 0, sector: "", classe: "" });
                fetchAssets(); // Atualiza lista do contexto
            } else {
                toast.error("Erro ao adicionar ativo");
            }
        } catch (error) {
            toast.error("Erro ao adicionar ativo");
            console.error(error);
        }
    };

    return (
        <>
            <Button onClick={() => setShowDialog(true)}>Adicionar Ativo</Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="bg-background text-foreground">
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <Label>Ticker</Label>
                            <Input
                                value={newAsset.ticker}
                                onChange={(e) => setNewAsset((prev) => ({ ...prev, ticker: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label>Quantidade</Label>
                            <Input
                                type="number"
                                value={newAsset.quantidade}
                                onChange={(e) =>
                                    setNewAsset((prev) => ({ ...prev, quantidade: Number(e.target.value) }))
                                }
                                min={0}
                            />
                        </div>
                        <div>
                            <Label>Setor</Label>
                            <Input
                                value={newAsset.sector}
                                onChange={(e) => setNewAsset((prev) => ({ ...prev, sector: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label>Classe</Label>
                            <Input
                                value={newAsset.classe}
                                onChange={(e) => setNewAsset((prev) => ({ ...prev, classe: e.target.value }))}
                                required
                            />
                        </div>
                        <Button type="submit">Adicionar</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddAssetButton;

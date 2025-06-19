import React, { createContext, useContext, useState, useEffect } from "react";

type Asset = {
    id: string | number;
    ticker: string;
    quantidade: number;
    preco: number;
    saldo: number;
    percentual: number;
    classe: string;
};

type AssetsContextType = {
    assets: Asset[];
    fetchAssets: () => void;
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
};

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const VITE_ASSETS_URL = import.meta.env.VITE_ASSETS_URL;

    const fetchAssets = () => {
        fetch(VITE_ASSETS_URL, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.data && data.data.result) {
                    const formatted = data.data.result.map((item: any) => ({
                        id: item.external_id_str,
                        ticker: item.ticker,
                        quantidade: item.quantity,
                        preco: item.price,
                        saldo: item.balance,
                        classe: item.type,
                        percentual: item.percentage,
                    }));
                    setAssets(formatted);
                }
            })
            .catch((error) => console.error("Erro ao buscar ativos:", error));
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return (
        <AssetsContext.Provider value={{ assets, fetchAssets, setAssets }}>
            {children}
        </AssetsContext.Provider>
    );
};

export const useAssets = () => {
    const context = useContext(AssetsContext);
    if (!context) {
        throw new Error("useAssets must be used within an AssetsProvider");
    }
    return context;
};

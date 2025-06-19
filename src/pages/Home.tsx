import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdealRealChart } from "../components/IdealChart.tsx"
import AssetsTable from "../components/AssetsTable.tsx";
import SectorManager from "../components/SectorManager.tsx";
import {ClassManager} from "../components/ClassesManager.tsx";
import AddAssetButton from "../components/AddAssetModal.tsx";
import {RebalanceTable} from "../components/RebalanceTable.tsx";

export const Home = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard da Carteira</h1>
            <AddAssetButton/>
            <Tabs defaultValue="summary" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="summary">Resumo</TabsTrigger>
                    <TabsTrigger value="sectors">Setores</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="rebalance">Rebalenceamento</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <IdealRealChart />
                    </div>
                    <AssetsTable/>

                </TabsContent>

                <TabsContent value="sectors">
                    <SectorManager />
                </TabsContent>

                <TabsContent value="classes">
                    <ClassManager />
                </TabsContent>

                <TabsContent value="rebalance">
                    <RebalanceTable />
                </TabsContent>
            </Tabs>
        </div>
    )
}


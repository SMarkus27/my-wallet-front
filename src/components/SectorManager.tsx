import { useEffect, useState } from "react"
import SectorSection from "./SectorSection"

interface Sector {
    id: number
    name: string
    percentage: number
}


const SectorManager = () => {
    const [sectors, setSectors] = useState<Sector[]>([])
    const VITE_SECTORS_URL = import.meta.env.VITE_SECTORS_URL;

    useEffect(() => {
        fetch(VITE_SECTORS_URL)
            .then(res => res.json())
            .then(data => {
                if (data && data.data && data.data.result) {
                    const formatted = data.data.result.map(item => ({
                        id: item.external_id_str,
                        name: item.name,
                        percentage: item.percentage,
                    }))
                    setSectors(formatted)
                } else {
                    console.error("Formato inesperado:", data)
                }
            })
            .catch(error => {
                console.error("Erro ao buscar setores:", error)
            })
    }, [])
    const handleAdd = (newSector: Sector) => {
        fetch(VITE_SECTORS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSector)
        })
            .then(res => res.json())
            .then(data => setSectors(prev => [...prev, data]))
    }

    const handleUpdate = (updated: Sector) => {

        fetch(`${VITE_SECTORS_URL}/${updated.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({percentage: updated.percentage})
        })
            .then(() => {
                setSectors(prev => prev.map(sec => (sec.id === updated.id ? updated : sec)))
            })
    }

    const handleDelete = (id: string) => {
        fetch(`${VITE_SECTORS_URL}/${id}`, { method: "DELETE" })
            .then(() => setSectors(prev => prev.filter(sec => sec.id !== id)))
    }
    return (
        <SectorSection
            sectors={sectors}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
        />
    )
}

export default SectorManager
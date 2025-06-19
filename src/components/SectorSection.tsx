import { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export interface Sector {
    id: string
    name: string
    percentage: number
}

interface SectorSectionProps {
    sectors: Sector[]
    onAdd: (sector: Omit<Sector, "id">) => void
    onUpdate: (sector: Sector) => void
    onDelete: (id: string) => void
}

const SectorSection = ({ sectors, onAdd, onUpdate, onDelete }: SectorSectionProps) => {
    const [newSector, setNewSector] = useState({ name: "", className: "", percentage: "" })
    const [editing, setEditing] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<{ [key: string]: string }>({})
    const handleAdd = () => {
        if (!newSector.name || !newSector.className || !newSector.percentage) return
        onAdd({
            name: newSector.name,
            percentage: parseFloat(newSector.percentage),
            asset_type: newSector.className,
        })
        setNewSector({ name: "", className: "", percentage: "" })
    }
    const handleEdit = (id: string) => {
        const sector = sectors.find(s => s.id === id)
        if (sector) {
            setEditing(id)
            setEditValues({
                name: sector.name,
                className: sector.className,
                percentage: sector.percentage.toString(),
            })
        }
    }
    const handleSaveEdit = () => {
        if (!editing) return
        onUpdate({
            id: editing,
            name: editValues.name,
            percentage: parseFloat(editValues.percentage),
        })
        setEditing(null)
        setEditValues({})
    }
    return (
        <Card>
            <CardHeader><CardTitle>Gerenciar Setores</CardTitle></CardHeader>
    <CardContent className="space-y-4">
    <div className="grid grid-cols-3 gap-2">
        <div>
            <Label>Setor</Label>
        <Input value={newSector.name} onChange={e => setNewSector({ ...newSector, name: e.target.value })} />
    </div>
    <div>
    <Label>Classe</Label>
    <Input value={newSector.className} onChange={e => setNewSector({ ...newSector, className: e.target.value })} />
    </div>
    <div>
    <Label>Porcentagem</Label>
    <Input type="number" value={newSector.percentage} onChange={e => setNewSector({ ...newSector, percentage: e.target.value })} />
    </div>
    </div>
    <Button onClick={handleAdd}>Adicionar Setor</Button>

    <div className="space-y-2">
        {sectors.map(sector => (
                <div key={sector.id} className="grid grid-cols-4 items-center gap-2 border rounded p-2">
            {editing === sector.id ? (
                <>
                    <Input value={editValues.name} onChange={e => setEditValues({ ...editValues, name: e.target.value })} />
    <Input type="number" value={editValues.percentage} onChange={e => setEditValues({ ...editValues, percentage: e.target.value })} />
    <div className="flex gap-2">
    <Button size="sm" onClick={handleSaveEdit}>Salvar</Button>
        <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
    </div>
    </>
) : (
        <>
            <span>{sector.name}</span>
        <span>{sector.percentage}%</span>
        <div className="flex gap-2">
    <Button size="sm" variant="outline" onClick={() => handleEdit(sector.id)}><PencilIcon className="w-4 h-4" /></Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(sector.id)}><Trash2Icon className="w-4 h-4" /></Button>
        </div>
        </>
)}
    </div>
))}
    </div>
    </CardContent>
    </Card>
)
}

export default SectorSection

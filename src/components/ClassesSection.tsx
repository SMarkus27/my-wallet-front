import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { PencilIcon, Trash2Icon, Plus } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Class {
    id: number
    name: string
    percentage: number
}

interface ClassSectionProps {
    classes: Class[]
    onAdd: (data: Omit<Class, "id">) => void
    onEdit: (id: number, data: Omit<Class, "id">) => void
    onDelete: (id: number) => void
}

export const ClassSection: React.FC<ClassSectionProps> = ({
                                                              classes,
                                                              onAdd,
                                                              onEdit,
                                                              onDelete,
                                                          }) => {
    const [editId, setEditId] = useState<number | null>(null)
    const [formData, setFormData] = useState({ name: "", percentage: "" })
    const [showAddDialog, setShowAddDialog] = useState(false)

    const startEdit = (cls: Class) => {
        setEditId(cls.id)
        setFormData({ name: cls.name, percentage: cls.percentage.toString() })
    }

    const cancelEdit = () => {
        setEditId(null)
        setFormData({ name: "", percentage: "" })
    }

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editId !== null) {
            onEdit(editId, {
                name: formData.name,
                percentage: Number(formData.percentage),
            })
            cancelEdit()
        }
    }

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd({
            name: formData.name,
            percentage: Number(formData.percentage),
        })
        setFormData({ name: "", percentage: "" })
        setShowAddDialog(false)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Classes</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Classe</TableHead>
                        <TableHead>Porcentagem</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classes.map((cls) =>
                        editId === cls.id ? (
                            <TableRow key={cls.id}>
                                <TableCell>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={formData.percentage}
                                        onChange={(e) =>
                                            setFormData({ ...formData, percentage: e.target.value })
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" variant="outline" onClick={handleEditSubmit}>
                                        Salvar
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                        Cancelar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow key={cls.id}>
                                <TableCell>{cls.name}</TableCell>
                                <TableCell>{cls.percentage}%</TableCell>
                                <TableCell className="flex gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => startEdit(cls)}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Editar</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onDelete(cls.id)}
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Deletar</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>

            {/* Add new class button and dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                    <Button className="mt-4" variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar Classe
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div>
                            <Label>Classe</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Porcentagem</Label>
                            <Input
                                type="number"
                                value={formData.percentage}
                                onChange={(e) =>
                                    setFormData({ ...formData, percentage: e.target.value })
                                }
                                min={0}
                                max={100}
                                required
                            />
                        </div>
                        <Button type="submit">Salvar</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

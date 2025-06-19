import React, { useEffect, useState } from "react"
import {ClassSection} from "./ClassesSection.tsx";

interface Class {
    id: number
    name: string
    percentage: number
}

export const ClassManager: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([])
    const VITE_ASSETS_CLASS_URL = import.meta.env.VITE_ASSETS_CLASS_URL;

    useEffect(() => {
        fetch(VITE_ASSETS_CLASS_URL, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.data && data.data.result) {
                    const formatted = data.data.result.map(item => ({
                        id: item.external_id_str,
                        name: item.name,
                        percentage: item.percentage,
                    }))
                    setClasses(formatted)
                } else {
                    console.error("Formato inesperado:", data)
                }
            })
            .catch(error => {
                console.error("Erro ao buscar setores:", error)
            })
    }, [])

    const addClass = (data: Omit<Class, "id">) => {
        fetch(VITE_ASSETS_CLASS_URL, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => setClasses(prev => [...prev, data]))
    }

    const editClass = (id: number, data: Omit<Class, "id">) => {
        fetch(`${VITE_ASSETS_CLASS_URL}/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({percentage: data.percentage})
        })
            .then(() => {
                setClasses((prev) =>
                    prev.map((cls) => (cls.id === id ? { ...cls, ...data } : cls))
                )
            })

    }

    const deleteClass = (id: number) => {
        fetch(`${VITE_ASSETS_CLASS_URL}/${id}`, {
            credentials: "include",
            method: "DELETE",
        })
            .then(() => setClasses((prev) => prev.filter((cls) => cls.id !== id)))
    }

    return (
        <ClassSection
            classes={classes}
            onAdd={addClass}
            onEdit={editClass}
            onDelete={deleteClass}
        />
    )
}

import {useEffect, useState} from "react";
import {db} from "../db/db.js";

export function useCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCategories()
    },[])

    async function loadCategories() {
        const all = await db.Categories.toArray()
        setCategories(all)
        setLoading(false)
    }

    return {categories, loading}
}
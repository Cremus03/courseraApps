import {db} from "./db.js";
import {CATEGORIES_PREDEFINED} from "../data/categories.js";

export async function seedCategories()  {
    const count = await db.Categories.count()

    if (count === 0){
        await db.Categories.bulkAdd(CATEGORIES_PREDEFINED)
        console.log('Categories added successfully')
    }
}
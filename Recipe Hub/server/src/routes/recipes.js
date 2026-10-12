const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const {
  serializeRecipeSummary,
  serializeRecipeDetail,
} = require("../utils/recipeSerializer");

const router = express.Router();

const FULL_INCLUDE = {
  ingredients: true,
  steps: true,
  reviews: { include: { user: true } },
  favorites: true,
  author: true,
};

const SUMMARY_INCLUDE = {
  reviews: true,
  author: true,
};

// GET /api/recipes - search, filter, sort
// Query params:
//   search       - matches title/description
//   ingredients  - comma-separated list of ingredients the user has ("ce am în frigider")
//   dietType     - vegetarian | vegan | gluten-free (matches if recipe has this tag)
//   mealType     - breakfast | lunch | dinner | snack
//   difficulty   - easy | medium | hard
//   maxPrepTime  - number (minutes)
//   sort         - popularity | time | calories | newest (default newest)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      search,
      ingredients,
      dietType,
      mealType,
      difficulty,
      maxPrepTime,
      sort,
    } = req.query;

    const where = { AND: [] };

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }
    if (mealType) where.AND.push({ mealType });
    if (difficulty) where.AND.push({ difficulty });
    if (dietType) where.AND.push({ dietTypes: { contains: dietType } });
    if (maxPrepTime) where.AND.push({ prepTime: { lte: Number(maxPrepTime) } });

    let recipes = await prisma.recipe.findMany({
      where,
      include: { ...SUMMARY_INCLUDE, ingredients: true },
    });

    // "Ce am în frigider" - filter/rank by ingredient overlap
    const wantedIngredients = ingredients
      ? ingredients
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];

    let matchCounts = new Map();
    if (wantedIngredients.length > 0) {
      recipes = recipes.filter((recipe) => {
        const names = recipe.ingredients.map((i) => i.name.toLowerCase());
        const matches = names.filter((name) =>
          wantedIngredients.some((w) => name.includes(w) || w.includes(name))
        ).length;
        matchCounts.set(recipe.id, matches);
        return matches > 0;
      });
    }

    const sortKey = sort || "newest";
    recipes.sort((a, b) => {
      if (wantedIngredients.length > 0) {
        const diff = (matchCounts.get(b.id) || 0) - (matchCounts.get(a.id) || 0);
        if (diff !== 0) return diff;
      }
      switch (sortKey) {
        case "popularity":
          return b.popularity - a.popularity;
        case "time":
          return (a.prepTime || 0) - (b.prepTime || 0);
        case "calories":
          return (a.calories || 0) - (b.calories || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    res.json(recipes.map(serializeRecipeSummary));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET /api/recipes/:id - full recipe detail
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(req.params.id) },
      include: FULL_INCLUDE,
    });

    if (!recipe) {
      return res.status(404).json({ error: "Rețeta nu a fost găsită" });
    }

    // increment popularity on each view
    await prisma.recipe.update({
      where: { id: recipe.id },
      data: { popularity: { increment: 1 } },
    });

    res.json(serializeRecipeDetail(recipe, req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

function buildNestedData(body) {
  const {
    title,
    description,
    imageUrl,
    mealType,
    dietTypes,
    difficulty,
    prepTime,
    cookTime,
    servings,
    calories,
    protein,
    carbs,
    fat,
    ingredients,
    steps,
  } = body;

  return {
    title,
    description,
    imageUrl,
    mealType,
    dietTypes: Array.isArray(dietTypes) ? dietTypes.join(",") : dietTypes || "",
    difficulty,
    prepTime: prepTime != null && prepTime !== "" ? Number(prepTime) : null,
    cookTime: cookTime != null && cookTime !== "" ? Number(cookTime) : null,
    servings: servings ? Number(servings) : 4,
    calories: calories != null && calories !== "" ? Number(calories) : null,
    protein: protein != null && protein !== "" ? Number(protein) : null,
    carbs: carbs != null && carbs !== "" ? Number(carbs) : null,
    fat: fat != null && fat !== "" ? Number(fat) : null,
    ingredients: {
      create: (ingredients || []).map((ing, idx) => ({
        name: ing.name,
        quantity: Number(ing.quantity) || 0,
        unit: ing.unit || "",
        category: ing.category || null,
        order: idx,
      })),
    },
    steps: {
      create: (steps || []).map((step, idx) => ({
        order: idx,
        text: typeof step === "string" ? step : step.text,
        timerSeconds:
          typeof step === "object" && step.timerSeconds
            ? Number(step.timerSeconds)
            : null,
      })),
    },
  };
}

// POST /api/recipes - create a recipe (requires auth)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, ingredients, steps } = req.body;
    if (!title || !ingredients || !ingredients.length || !steps || !steps.length) {
      return res.status(400).json({
        error: "title, ingredients și steps sunt obligatorii",
      });
    }

    const recipe = await prisma.recipe.create({
      data: {
        ...buildNestedData(req.body),
        authorId: req.userId,
      },
      include: FULL_INCLUDE,
    });

    res.status(201).json(serializeRecipeDetail(recipe, req.userId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// PUT /api/recipes/:id - update a recipe (only author)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Rețeta nu a fost găsită" });
    if (existing.authorId && existing.authorId !== req.userId) {
      return res.status(403).json({ error: "Nu poți edita rețeta altui utilizator" });
    }

    const data = buildNestedData(req.body);

    const recipe = await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({ where: { recipeId: id } });
      await tx.step.deleteMany({ where: { recipeId: id } });
      return tx.recipe.update({
        where: { id },
        data,
        include: FULL_INCLUDE,
      });
    });

    res.json(serializeRecipeDetail(recipe, req.userId));
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE /api/recipes/:id - delete a recipe (only author)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Rețeta nu a fost găsită" });
    if (existing.authorId && existing.authorId !== req.userId) {
      return res.status(403).json({ error: "Nu poți șterge rețeta altui utilizator" });
    }

    await prisma.recipe.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

module.exports = router;

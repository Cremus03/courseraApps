const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function serializeEntry(entry) {
  return {
    id: entry.id,
    weekStart: entry.weekStart,
    dayOfWeek: entry.dayOfWeek,
    mealType: entry.mealType,
    recipe: entry.recipe
      ? {
          id: entry.recipe.id,
          title: entry.recipe.title,
          imageUrl: entry.recipe.imageUrl,
          prepTime: entry.recipe.prepTime,
          cookTime: entry.recipe.cookTime,
          calories: entry.recipe.calories,
        }
      : null,
  };
}

// GET /api/meal-plan?weekStart=YYYY-MM-DD - entries for a given week
router.get("/", requireAuth, async (req, res) => {
  try {
    const { weekStart } = req.query;
    const entries = await prisma.mealPlanEntry.findMany({
      where: {
        userId: req.userId,
        ...(weekStart ? { weekStart } : {}),
      },
      include: { recipe: true },
      orderBy: [{ dayOfWeek: "asc" }],
    });
    res.json(entries.map(serializeEntry));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
});

// POST /api/meal-plan - add a recipe to the plan
router.post("/", requireAuth, async (req, res) => {
  try {
    const { recipeId, weekStart, dayOfWeek, mealType } = req.body;
    if (!recipeId || !weekStart || dayOfWeek == null) {
      return res
        .status(400)
        .json({ error: "recipeId, weekStart și dayOfWeek sunt obligatorii" });
    }

    const entry = await prisma.mealPlanEntry.create({
      data: {
        userId: req.userId,
        recipeId: Number(recipeId),
        weekStart,
        dayOfWeek: Number(dayOfWeek),
        mealType: mealType || null,
      },
      include: { recipe: true },
    });
    res.status(201).json(serializeEntry(entry));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add meal plan entry" });
  }
});

// PUT /api/meal-plan/:id - move entry (drag & drop -> new day/mealType)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { dayOfWeek, mealType, weekStart } = req.body;

    const existing = await prisma.mealPlanEntry.findFirst({
      where: { id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: "Intrare inexistentă" });

    const entry = await prisma.mealPlanEntry.update({
      where: { id },
      data: {
        dayOfWeek: dayOfWeek != null ? Number(dayOfWeek) : undefined,
        mealType: mealType !== undefined ? mealType : undefined,
        weekStart: weekStart !== undefined ? weekStart : undefined,
      },
      include: { recipe: true },
    });
    res.json(serializeEntry(entry));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update meal plan entry" });
  }
});

// DELETE /api/meal-plan/:id - remove entry
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.mealPlanEntry.deleteMany({ where: { id, userId: req.userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete meal plan entry" });
  }
});

module.exports = router;

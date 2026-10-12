const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function serializeItem(item) {
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    category: item.category || "Altele",
    checked: item.checked,
  };
}

// GET /api/shopping-list - current user's list, grouped by category
router.get("/", requireAuth, async (req, res) => {
  try {
    const items = await prisma.shoppingListItem.findMany({
      where: { userId: req.userId },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    const grouped = {};
    for (const item of items.map(serializeItem)) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    }

    res.json({ items: items.map(serializeItem), grouped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch shopping list" });
  }
});

// POST /api/shopping-list/generate - build list from selected recipes (with scaling)
// body: { recipes: [{ recipeId, servings }] }
router.post("/generate", requireAuth, async (req, res) => {
  try {
    const { recipes: selections } = req.body;
    if (!Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ error: "recipes este obligatoriu" });
    }

    const recipeIds = selections.map((s) => Number(s.recipeId));
    const recipes = await prisma.recipe.findMany({
      where: { id: { in: recipeIds } },
      include: { ingredients: true },
    });

    // Aggregate scaled quantities keyed by "name|unit"
    const aggregated = new Map();
    for (const selection of selections) {
      const recipe = recipes.find((r) => r.id === Number(selection.recipeId));
      if (!recipe) continue;
      const targetServings = Number(selection.servings) || recipe.servings || 1;
      const ratio = targetServings / (recipe.servings || 1);

      for (const ing of recipe.ingredients) {
        const key = `${ing.name.toLowerCase()}|${ing.unit}`;
        const scaledQty = ing.quantity * ratio;
        if (aggregated.has(key)) {
          aggregated.get(key).quantity += scaledQty;
        } else {
          aggregated.set(key, {
            name: ing.name,
            unit: ing.unit,
            category: ing.category || "Altele",
            quantity: scaledQty,
          });
        }
      }
    }

    const created = await prisma.$transaction(
      Array.from(aggregated.values()).map((item) =>
        prisma.shoppingListItem.create({
          data: {
            userId: req.userId,
            name: item.name,
            quantity: Math.round(item.quantity * 100) / 100,
            unit: item.unit,
            category: item.category,
          },
        })
      )
    );

    res.status(201).json(created.map(serializeItem));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate shopping list" });
  }
});

// PATCH /api/shopping-list/:id - toggle checked state
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.shoppingListItem.findFirst({
      where: { id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: "Element inexistent" });

    const item = await prisma.shoppingListItem.update({
      where: { id },
      data: { checked: req.body.checked ?? !existing.checked },
    });
    res.json(serializeItem(item));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE /api/shopping-list/:id - remove one item
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.shoppingListItem.deleteMany({ where: { id, userId: req.userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// DELETE /api/shopping-list - clear entire list (or only checked items with ?checkedOnly=true)
router.delete("/", requireAuth, async (req, res) => {
  try {
    const { checkedOnly } = req.query;
    await prisma.shoppingListItem.deleteMany({
      where: {
        userId: req.userId,
        ...(checkedOnly === "true" ? { checked: true } : {}),
      },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear shopping list" });
  }
});

module.exports = router;

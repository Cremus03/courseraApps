const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");
const { serializeRecipeSummary } = require("../utils/recipeSerializer");

const router = express.Router();

// GET /api/favorites - list current user's favorite recipes
router.get("/", requireAuth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: { recipe: { include: { reviews: true, author: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map((f) => serializeRecipeSummary(f.recipe)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// POST /api/favorites/:recipeId - add to favorites
router.post("/:recipeId", requireAuth, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    await prisma.favorite.upsert({
      where: { userId_recipeId: { userId: req.userId, recipeId } },
      update: {},
      create: { userId: req.userId, recipeId },
    });
    res.status(201).json({ favorited: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// DELETE /api/favorites/:recipeId - remove from favorites
router.delete("/:recipeId", requireAuth, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    await prisma.favorite
      .delete({ where: { userId_recipeId: { userId: req.userId, recipeId } } })
      .catch(() => null);
    res.json({ favorited: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;

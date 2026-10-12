const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");
const { serializeRecipeSummary } = require("../utils/recipeSerializer");

const router = express.Router();

// GET /api/history - list current user's cooked history (most recent first)
router.get("/", requireAuth, async (req, res) => {
  try {
    const history = await prisma.cookedHistory.findMany({
      where: { userId: req.userId },
      include: { recipe: { include: { reviews: true, author: true } } },
      orderBy: { cookedAt: "desc" },
    });
    res.json(
      history.map((h) => ({
        id: h.id,
        cookedAt: h.cookedAt,
        recipe: serializeRecipeSummary(h.recipe),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// POST /api/history/:recipeId - mark a recipe as cooked (today)
router.post("/:recipeId", requireAuth, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const entry = await prisma.cookedHistory.create({
      data: { userId: req.userId, recipeId },
    });
    res.status(201).json({ id: entry.id, cookedAt: entry.cookedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to record history" });
  }
});

// DELETE /api/history/:id - remove a history entry
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.cookedHistory.deleteMany({ where: { id, userId: req.userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete history entry" });
  }
});

module.exports = router;

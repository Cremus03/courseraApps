const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// POST /api/recipes/:recipeId/reviews - create or update the current user's review
router.post("/", requireAuth, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "rating trebuie să fie între 1 și 5" });
    }

    const review = await prisma.review.upsert({
      where: { recipeId_userId: { recipeId, userId: req.userId } },
      update: { rating: Number(rating), comment },
      create: { recipeId, userId: req.userId, rating: Number(rating), comment },
      include: { user: true },
    });

    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      userName: review.user.name,
      userId: review.userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save review" });
  }
});

// DELETE /api/recipes/:recipeId/reviews - delete the current user's review
router.delete("/", requireAuth, async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    await prisma.review
      .delete({ where: { recipeId_userId: { recipeId, userId: req.userId } } })
      .catch(() => null);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;

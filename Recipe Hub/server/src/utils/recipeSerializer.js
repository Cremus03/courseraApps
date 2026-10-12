function avgRating(reviews) {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function serializeRecipeSummary(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    mealType: recipe.mealType,
    dietTypes: recipe.dietTypes ? recipe.dietTypes.split(",").filter(Boolean) : [],
    difficulty: recipe.difficulty,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    popularity: recipe.popularity,
    authorId: recipe.authorId,
    authorName: recipe.author ? recipe.author.name : null,
    avgRating: avgRating(recipe.reviews),
    reviewCount: recipe.reviews ? recipe.reviews.length : 0,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  };
}

function serializeRecipeDetail(recipe, currentUserId) {
  return {
    ...serializeRecipeSummary(recipe),
    ingredients: (recipe.ingredients || [])
      .sort((a, b) => a.order - b.order)
      .map((ing) => ({
        id: ing.id,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        category: ing.category,
      })),
    steps: (recipe.steps || [])
      .sort((a, b) => a.order - b.order)
      .map((step) => ({
        id: step.id,
        order: step.order,
        text: step.text,
        timerSeconds: step.timerSeconds,
      })),
    reviews: (recipe.reviews || []).map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: r.user ? r.user.name : "Anonim",
      userId: r.userId,
    })),
    isFavorite: currentUserId
      ? Boolean(
          (recipe.favorites || []).some((f) => f.userId === currentUserId)
        )
      : false,
  };
}

module.exports = { serializeRecipeSummary, serializeRecipeDetail, avgRating };

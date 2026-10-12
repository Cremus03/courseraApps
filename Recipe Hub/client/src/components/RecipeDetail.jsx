import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Flame,
  Heart,
  Pencil,
  Play,
  Star,
  Trash2,
  Pause,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import PortionCalculator from "./PortionCalculator.jsx";

const MEAL_LABELS = {
  breakfast: "Mic dejun",
  lunch: "Prânz",
  dinner: "Cină",
  snack: "Gustare",
};

const DIFFICULTY_LABELS = { easy: "Ușor", medium: "Mediu", hard: "Dificil" };

function formatQuantity(q) {
  return Number.isInteger(q) ? q : Math.round(q * 100) / 100;
}

function TimerInner({ seconds }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  function toggle() {
    if (remaining <= 0) return;
    setRunning((r) => !r);
  }
  function reset() {
    setRunning(false);
    setRemaining(seconds);
  }

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-xs font-mono text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
      <button
        onClick={toggle}
        className="p-1 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        title={running ? "Pauză" : "Start"}
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        onClick={reset}
        className="p-1 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        title="Resetează"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}

export default function RecipeDetail({
  recipe,
  isOwner,
  onToggleFavorite,
  onMarkCooked,
  onSubmitReview,
  onDelete,
}) {
  const [servings, setServings] = useState(recipe.servings);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const ratio = servings / recipe.servings;

  const scaledIngredients = useMemo(
    () =>
      recipe.ingredients.map((ing) => ({
        ...ing,
        scaledQuantity: formatQuantity(ing.quantity * ratio),
      })),
    [recipe.ingredients, ratio]
  );

  const scaledCalories = recipe.calories ? Math.round(recipe.calories * ratio) : null;
  const scaledProtein = recipe.protein ? Math.round(recipe.protein * ratio) : null;
  const scaledCarbs = recipe.carbs ? Math.round(recipe.carbs * ratio) : null;
  const scaledFat = recipe.fat ? Math.round(recipe.fat * ratio) : null;

  function handleReviewSubmit(e) {
    e.preventDefault();
    onSubmitReview({ rating: reviewRating, comment: reviewComment });
    setReviewComment("");
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{recipe.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.mealType && (
                  <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {MEAL_LABELS[recipe.mealType] || recipe.mealType}
                  </span>
                )}
                {recipe.difficulty && (
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                    {DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}
                  </span>
                )}
                {recipe.dietTypes.map((diet) => (
                  <span
                    key={diet}
                    className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg border transition ${
                  recipe.isFavorite
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-400"
                }`}
                title="Favorite"
              >
                <Heart size={18} fill={recipe.isFavorite ? "currentColor" : "none"} />
              </button>
              {isOwner && (
                <>
                  <Link
                    to={`/recipes/${recipe.id}/edit`}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                    title="Editează"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={onDelete}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                    title="Șterge"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {recipe.description && (
            <p className="text-gray-600 mt-3">{recipe.description}</p>
          )}

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
            {(recipe.prepTime || recipe.cookTime) && (
              <span className="flex items-center gap-1">
                <Clock size={16} /> {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                total
              </span>
            )}
            {recipe.avgRating != null && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" /> {recipe.avgRating} (
                {recipe.reviewCount} review-uri)
              </span>
            )}
            <button
              onClick={onMarkCooked}
              className="flex items-center gap-1 text-brand-600 hover:underline"
            >
              <CheckCircle2 size={16} /> Am gătit asta
            </button>
          </div>

          <div className="mt-5">
            <PortionCalculator
              baseServings={recipe.servings}
              servings={servings}
              onChange={setServings}
            />
          </div>

          {scaledCalories != null && (
            <div className="grid grid-cols-4 gap-3 mt-4 text-center">
              <NutrientBox label="Calorii" value={`${scaledCalories} kcal`} icon={<Flame size={14} />} />
              <NutrientBox label="Proteine" value={`${scaledProtein} g`} />
              <NutrientBox label="Carbohidrați" value={`${scaledCarbs} g`} />
              <NutrientBox label="Grăsimi" value={`${scaledFat} g`} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-2">Ingrediente</h2>
              <ul className="space-y-1.5 text-gray-600">
                {scaledIngredients.map((ing) => (
                  <li key={ing.id} className="flex justify-between text-sm border-b border-dashed border-gray-100 pb-1">
                    <span>{ing.name}</span>
                    <span className="font-medium text-gray-800">
                      {ing.scaledQuantity} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-2">Preparare</h2>
              <ol className="space-y-3">
                {recipe.steps.map((step, idx) => (
                  <li key={step.id} className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-gray-600 text-sm">{step.text}</p>
                      {step.timerSeconds ? <TimerInner seconds={step.timerSeconds} /> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">
              Review-uri ({recipe.reviewCount})
            </h2>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2 mb-5 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setReviewRating(n)}
                    className={n <= reviewRating ? "text-amber-500" : "text-gray-300"}
                  >
                    <Star size={20} fill="currentColor" />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Scrie un review..."
                rows={2}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                className="self-end bg-brand-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-brand-700"
              >
                Trimite review
              </button>
            </form>

            <div className="space-y-3">
              {recipe.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-800">{review.userName}</span>
                    <span className="flex text-amber-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </span>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                </div>
              ))}
              {recipe.reviews.length === 0 && (
                <p className="text-sm text-gray-400">Niciun review încă. Fii primul!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutrientBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 text-sm">{value}</p>
    </div>
  );
}

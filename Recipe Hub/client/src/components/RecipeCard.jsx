import { Link } from "react-router-dom";
import { Clock, Flame, Star, Utensils } from "lucide-react";

const MEAL_LABELS = {
  breakfast: "Mic dejun",
  lunch: "Prânz",
  dinner: "Cină",
  snack: "Gustare",
};

const DIFFICULTY_LABELS = {
  easy: "Ușor",
  medium: "Mediu",
  hard: "Dificil",
};

const DIFFICULTY_COLORS = {
  easy: "bg-green-50 text-green-700",
  medium: "bg-yellow-50 text-yellow-700",
  hard: "bg-red-50 text-red-700",
};

export default function RecipeCard({ recipe }) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-orange-100"
    >
      <div className="h-40 bg-brand-100 flex items-center justify-center overflow-hidden relative">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Utensils size={40} className="text-brand-400" />
        )}
        {recipe.difficulty && (
          <span
            className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded ${DIFFICULTY_COLORS[recipe.difficulty] || "bg-gray-50 text-gray-600"}`}
          >
            {DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {recipe.title}
        </h3>

        <div className="flex flex-wrap gap-1 mt-1">
          {recipe.mealType && (
            <span className="inline-block text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              {MEAL_LABELS[recipe.mealType] || recipe.mealType}
            </span>
          )}
          {(recipe.dietTypes || []).slice(0, 2).map((diet) => (
            <span
              key={diet}
              className="inline-block text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded"
            >
              {diet}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {totalTime} min
            </span>
          )}
          {recipe.calories != null && (
            <span className="flex items-center gap-1">
              <Flame size={14} /> {recipe.calories} kcal
            </span>
          )}
          {recipe.avgRating != null && (
            <span className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" /> {recipe.avgRating} ({recipe.reviewCount})
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

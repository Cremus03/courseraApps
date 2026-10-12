import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { favoritesApi } from "../services/recipeApi.js";
import RecipeCard from "../components/RecipeCard.jsx";

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    favoritesApi
      .list()
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Heart className="text-red-500" /> Rețete favorite
      </h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Se încarcă...</p>}
      {!loading && recipes.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          Nu ai încă rețete favorite. Apasă pe inimă pe o rețetă pentru a o salva aici.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

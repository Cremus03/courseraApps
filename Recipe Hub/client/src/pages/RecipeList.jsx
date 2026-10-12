import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getRecipes } from "../api.js";
import RecipeCard from "../components/RecipeCard.jsx";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getRecipes({ search })
      .then((data) => {
        if (active) setRecipes(data);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [search]);

  return (
    <div>
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Caută rețete..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Se încarcă...</p>}

      {!loading && recipes.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          Nicio rețetă găsită. Adaugă prima rețetă!
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

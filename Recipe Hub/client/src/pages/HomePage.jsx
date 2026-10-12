import SearchBar from "../components/SearchBar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { useRecipeSearch } from "../hooks/useRecipeSearch.js";

export default function HomePage() {
  const { filters, updateFilter, resetFilters, recipes, loading, error } =
    useRecipeSearch();

  return (
    <div>
      <SearchBar filters={filters} onChange={updateFilter} onReset={resetFilters} />

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Se încarcă...</p>}

      {!loading && recipes.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          Nicio rețetă găsită. Încearcă alte filtre sau adaugă prima rețetă!
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

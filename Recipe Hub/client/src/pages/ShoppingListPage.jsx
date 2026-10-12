import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { recipeApi } from "../services/recipeApi.js";
import { useShoppingList } from "../hooks/useShoppingList.js";
import ShoppingListComponent from "../components/ShoppingList.jsx";

export default function ShoppingListPage() {
  const {
    grouped,
    error,
    generateFromRecipes,
    toggleItem,
    removeItem,
    clearAll,
  } = useShoppingList();

  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    recipeApi.search({}).then(setRecipes).catch(() => {});
  }, []);

  function toggleSelect(recipeId, servings) {
    setSelected((s) => {
      const next = { ...s };
      if (next[recipeId]) delete next[recipeId];
      else next[recipeId] = servings;
      return next;
    });
  }

  async function handleGenerate() {
    const selections = Object.entries(selected).map(([recipeId, servings]) => ({
      recipeId: Number(recipeId),
      servings,
    }));
    if (selections.length === 0) return;
    await generateFromRecipes(selections);
    setSelected({});
  }

  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Selectează rețete pentru cumpărături
        </h2>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {recipes.map((recipe) => (
            <label
              key={recipe.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(selected[recipe.id])}
                  onChange={() => toggleSelect(recipe.id, recipe.servings)}
                  className="accent-brand-600"
                />
                {recipe.title}
              </span>
              <span className="text-xs text-gray-400">{recipe.servings} porții</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          disabled={Object.keys(selected).length === 0}
          className="mt-4 w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-40"
        >
          Generează lista de cumpărături
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart /> Lista de cumpărături
        </h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <ShoppingListComponent
          grouped={grouped}
          onToggle={toggleItem}
          onRemove={removeItem}
          onClearChecked={() => clearAll(true)}
          onClearAll={() => clearAll(false)}
        />
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { recipeApi } from "../services/recipeApi.js";

const DEFAULT_FILTERS = {
  search: "",
  ingredients: "",
  dietType: "",
  mealType: "",
  difficulty: "",
  maxPrepTime: "",
  sort: "newest",
};

export function useRecipeSearch(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedFilters = useDebouncedValue(filters, 350);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    recipeApi
      .search(debouncedFilters)
      .then((data) => active && setRecipes(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debouncedFilters]);

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return { filters, updateFilter, resetFilters, recipes, loading, error };
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [JSON.stringify(value), delay]);

  return useMemo(() => debounced, [debounced]);
}

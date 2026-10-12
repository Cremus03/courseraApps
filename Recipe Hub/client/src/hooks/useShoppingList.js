import { useCallback, useEffect, useState } from "react";
import { shoppingListApi } from "../services/recipeApi.js";

export function useShoppingList() {
  const [items, setItems] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    return shoppingListApi
      .get()
      .then((data) => {
        setItems(data.items);
        setGrouped(data.grouped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function generateFromRecipes(selections) {
    setError("");
    try {
      await shoppingListApi.generate(selections);
      await refresh();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function toggleItem(id, checked) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );
    try {
      await shoppingListApi.toggle(id, checked);
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await shoppingListApi.removeItem(id);
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }

  async function clearAll(checkedOnly = false) {
    try {
      await shoppingListApi.clear(checkedOnly);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    items,
    grouped,
    loading,
    error,
    generateFromRecipes,
    toggleItem,
    removeItem,
    clearAll,
    refresh,
  };
}

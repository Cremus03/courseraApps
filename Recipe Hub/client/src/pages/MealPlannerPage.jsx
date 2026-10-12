import { useCallback, useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { mealPlanApi, recipeApi } from "../services/recipeApi.js";
import MealPlanner from "../components/MealPlanner.jsx";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export default function MealPlannerPage() {
  const [weekStart, setWeekStart] = useState(toISODate(getMonday(new Date())));
  const [entries, setEntries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const loadEntries = useCallback(() => {
    mealPlanApi
      .list(weekStart)
      .then(setEntries)
      .catch((err) => setError(err.message));
  }, [weekStart]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    recipeApi.search({}).then(setRecipes).catch(() => {});
  }, []);

  function shiftWeek(days) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + days);
    setWeekStart(toISODate(d));
  }

  async function handleAssign(recipeId, dayOfWeek, mealType) {
    try {
      await mealPlanApi.add({ recipeId, weekStart, dayOfWeek, mealType });
      loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMove(entryId, dayOfWeek, mealType) {
    try {
      await mealPlanApi.move(entryId, { dayOfWeek, mealType });
      loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(entryId) {
    try {
      await mealPlanApi.remove(entryId);
      loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays /> Meal Planner
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => shiftWeek(-7)} className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600 font-medium">
            {new Date(weekStart).toLocaleDateString("ro-RO")} - {weekEnd.toLocaleDateString("ro-RO")}
          </span>
          <button onClick={() => shiftWeek(7)} className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <MealPlanner
        entries={entries}
        pickerRecipes={recipes}
        onAssign={handleAssign}
        onMove={handleMove}
        onRemove={handleRemove}
      />
    </div>
  );
}

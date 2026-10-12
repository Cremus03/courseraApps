import { useState } from "react";
import { X } from "lucide-react";

const DAYS = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
const MEAL_TYPES = [
  { value: "breakfast", label: "Mic dejun" },
  { value: "lunch", label: "Prânz" },
  { value: "dinner", label: "Cină" },
  { value: "snack", label: "Gustare" },
];

export default function MealPlanner({ entries, pickerRecipes, onAssign, onMove, onRemove }) {
  const [dragRecipeId, setDragRecipeId] = useState(null);

  function entriesFor(dayIndex, mealType) {
    return entries.filter((e) => e.dayOfWeek === dayIndex && e.mealType === mealType);
  }

  function handleDropOnCell(e, dayIndex, mealType) {
    e.preventDefault();
    const entryId = e.dataTransfer.getData("entryId");
    const recipeId = e.dataTransfer.getData("recipeId");

    if (entryId) {
      onMove(Number(entryId), dayIndex, mealType);
    } else if (recipeId) {
      onAssign(Number(recipeId), dayIndex, mealType);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-24"></th>
              {DAYS.map((day) => (
                <th key={day} className="p-2 text-gray-600 font-medium text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((meal) => (
              <tr key={meal.value}>
                <td className="p-2 text-xs font-semibold text-gray-400 uppercase align-top">
                  {meal.label}
                </td>
                {DAYS.map((_, dayIndex) => (
                  <td
                    key={dayIndex}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnCell(e, dayIndex, meal.value)}
                    className="border border-gray-100 p-1 align-top min-h-[70px] min-w-[110px] bg-gray-50/50"
                  >
                    <div className="space-y-1">
                      {entriesFor(dayIndex, meal.value).map((entry) => (
                        <div
                          key={entry.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("entryId", entry.id)}
                          className="bg-brand-100 text-brand-800 text-xs rounded px-2 py-1 flex items-center justify-between gap-1 cursor-move"
                        >
                          <span className="truncate">{entry.recipe?.title}</span>
                          <button onClick={() => onRemove(entry.id)} className="text-brand-500 hover:text-red-500">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full lg:w-56 shrink-0">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Trage o rețetă în calendar
        </h3>
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
          {pickerRecipes.map((recipe) => (
            <div
              key={recipe.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("recipeId", recipe.id);
                setDragRecipeId(recipe.id);
              }}
              className={`bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-move hover:border-brand-300 ${
                dragRecipeId === recipe.id ? "opacity-50" : ""
              }`}
            >
              {recipe.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const DIET_OPTIONS = [
  { value: "", label: "Toate dietele" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "fara-gluten", label: "Fără gluten" },
];

const MEAL_OPTIONS = [
  { value: "", label: "Toate mesele" },
  { value: "breakfast", label: "Mic dejun" },
  { value: "lunch", label: "Prânz" },
  { value: "dinner", label: "Cină" },
  { value: "snack", label: "Gustare" },
];

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Orice dificultate" },
  { value: "easy", label: "Ușor" },
  { value: "medium", label: "Mediu" },
  { value: "hard", label: "Dificil" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Cele mai noi" },
  { value: "popularity", label: "Popularitate" },
  { value: "time", label: "Timp preparare" },
  { value: "calories", label: "Calorii" },
];

export default function SearchBar({ filters, onChange, onReset }) {
  const [showFilters, setShowFilters] = useState(false);

  const selectClass =
    "px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";

  const activeFilterCount = ["dietType", "mealType", "difficulty", "maxPrepTime"].filter(
    (k) => filters[k]
  ).length;

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Caută rețete după nume..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-1.5 px-4 rounded-lg border text-sm font-medium transition ${
            showFilters
              ? "bg-brand-600 text-white border-brand-600"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filtre
          {activeFilterCount > 0 && (
            <span className="bg-white text-brand-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative mt-2">
        <input
          type="text"
          placeholder='Ce ai în frigider? (ex: "ou, roșii, pui")'
          value={filters.ingredients}
          onChange={(e) => onChange("ingredients", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-dashed border-brand-300 bg-brand-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {showFilters && (
        <div className="mt-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-3">
          <select
            className={selectClass}
            value={filters.mealType}
            onChange={(e) => onChange("mealType", e.target.value)}
          >
            {MEAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={filters.dietType}
            onChange={(e) => onChange("dietType", e.target.value)}
          >
            {DIET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={filters.difficulty}
            onChange={(e) => onChange("difficulty", e.target.value)}
          >
            {DIFFICULTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Timp max (min)"
            className={selectClass}
            value={filters.maxPrepTime}
            onChange={(e) => onChange("maxPrepTime", e.target.value)}
          />

          <select
            className={selectClass}
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-red-500"
          >
            <X size={16} /> Resetează filtrele
          </button>
        </div>
      )}
    </div>
  );
}

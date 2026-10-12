import { Minus, Plus, Users } from "lucide-react";

export default function PortionCalculator({ baseServings, servings, onChange }) {
  const ratio = servings / baseServings;

  function setServings(value) {
    const clamped = Math.max(1, Math.min(50, value));
    onChange(clamped);
  }

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 font-medium text-gray-700 text-sm">
          <Users size={16} /> Calculator de porții
        </span>
        <span className="text-xs text-gray-500">
          Rețetă originală: {baseServings} porții
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setServings(servings - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <Minus size={16} />
        </button>

        <input
          type="range"
          min={1}
          max={20}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="flex-1 accent-brand-600"
        />

        <button
          onClick={() => setServings(servings + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <Plus size={16} />
        </button>

        <input
          type="number"
          min={1}
          max={50}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value) || 1)}
          className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-center text-sm"
        />
        <span className="text-sm text-gray-600">porții</span>
      </div>

      {ratio !== 1 && (
        <p className="text-xs text-brand-700 mt-2">
          Cantitățile sunt scalate ×{ratio.toFixed(2)} față de rețeta originală.
        </p>
      )}
    </div>
  );
}

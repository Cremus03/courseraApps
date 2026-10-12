import { Check, ShoppingCart, Trash2, X } from "lucide-react";

export default function ShoppingList({ grouped, onToggle, onRemove, onClearChecked, onClearAll }) {
  const categories = Object.keys(grouped).sort();
  const totalItems = categories.reduce((sum, c) => sum + grouped[c].length, 0);
  const checkedCount = categories.reduce(
    (sum, c) => sum + grouped[c].filter((i) => i.checked).length,
    0
  );

  if (totalItems === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <ShoppingCart size={40} className="mx-auto mb-3" />
        <p>Lista ta de cumpărături e goală.</p>
        <p className="text-sm">Selectează rețete pentru a genera lista.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {checkedCount}/{totalItems} bifate
        </span>
        <div className="flex gap-2">
          <button
            onClick={onClearChecked}
            className="text-xs text-gray-500 hover:text-brand-600 flex items-center gap-1"
          >
            <Check size={14} /> Șterge bifate
          </button>
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
          >
            <Trash2 size={14} /> Golește lista
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {category}
            </h3>
            <ul className="space-y-1.5">
              {grouped[category].map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2"
                >
                  <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => onToggle(item.id, e.target.checked)}
                      className="w-4 h-4 accent-brand-600"
                    />
                    <span className={item.checked ? "line-through text-gray-400" : "text-gray-700"}>
                      {item.name}
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

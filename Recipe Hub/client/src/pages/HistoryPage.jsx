import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { historyApi } from "../services/recipeApi.js";
import RecipeCard from "../components/RecipeCard.jsx";

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    historyApi
      .list()
      .then(setEntries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <History /> Istoric rețete gătite
      </h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Se încarcă...</p>}
      {!loading && entries.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          Nu ai marcat încă nicio rețetă ca gătită. Apasă "Am gătit asta" pe pagina unei rețete.
        </p>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-4 bg-white rounded-xl shadow p-3">
            <div className="flex-1">
              <RecipeCard recipe={entry.recipe} />
            </div>
            <span className="text-xs text-gray-400 shrink-0">
              {new Date(entry.cookedAt).toLocaleDateString("ro-RO")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

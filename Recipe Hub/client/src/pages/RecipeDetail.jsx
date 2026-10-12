import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { recipeApi, favoritesApi, historyApi, reviewApi } from "../services/recipeApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import RecipeDetailView from "../components/RecipeDetail.jsx";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    recipeApi
      .get(id)
      .then(setRecipe)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!confirm("Sigur vrei să ștergi această rețetă?")) return;
    try {
      await recipeApi.remove(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleFavorite() {
    if (!user) return navigate("/login");
    try {
      if (recipe.isFavorite) {
        await favoritesApi.remove(id);
      } else {
        await favoritesApi.add(id);
      }
      setRecipe((r) => ({ ...r, isFavorite: !r.isFavorite }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMarkCooked() {
    if (!user) return navigate("/login");
    try {
      await historyApi.add(id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmitReview({ rating, comment }) {
    if (!user) return navigate("/login");
    try {
      await reviewApi.submit(id, { rating, comment });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!recipe) return <p className="text-gray-500">Se încarcă...</p>;

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-brand-600 mb-4 hover:underline"
      >
        <ArrowLeft size={16} /> Înapoi la rețete
      </Link>

      <RecipeDetailView
        recipe={recipe}
        isOwner={user && user.id === recipe.authorId}
        onToggleFavorite={handleToggleFavorite}
        onMarkCooked={handleMarkCooked}
        onSubmitReview={handleSubmitReview}
        onDelete={handleDelete}
      />
    </div>
  );
}

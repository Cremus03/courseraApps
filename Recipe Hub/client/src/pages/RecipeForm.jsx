import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { recipeApi } from "../services/recipeApi.js";

const DIET_CHOICES = ["vegetarian", "vegan", "fara-gluten"];

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  mealType: "lunch",
  dietTypes: [],
  difficulty: "easy",
  prepTime: "",
  cookTime: "",
  servings: 4,
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  ingredients: [{ name: "", quantity: "", unit: "", category: "" }],
  steps: [{ text: "", timerSeconds: "" }],
};

export default function RecipeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      recipeApi
        .get(id)
        .then((data) =>
          setForm({
            ...data,
            prepTime: data.prepTime ?? "",
            cookTime: data.cookTime ?? "",
            calories: data.calories ?? "",
            protein: data.protein ?? "",
            carbs: data.carbs ?? "",
            fat: data.fat ?? "",
            ingredients: data.ingredients.length
              ? data.ingredients
              : emptyForm.ingredients,
            steps: data.steps.length
              ? data.steps.map((s) => ({ text: s.text, timerSeconds: s.timerSeconds ?? "" }))
              : emptyForm.steps,
          })
        )
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleDiet(diet) {
    setForm((f) => ({
      ...f,
      dietTypes: f.dietTypes.includes(diet)
        ? f.dietTypes.filter((d) => d !== diet)
        : [...f.dietTypes, diet],
    }));
  }

  function updateIngredient(index, field, value) {
    setForm((f) => {
      const list = [...f.ingredients];
      list[index] = { ...list[index], [field]: value };
      return { ...f, ingredients: list };
    });
  }

  function addIngredient() {
    setForm((f) => ({
      ...f,
      ingredients: [...f.ingredients, { name: "", quantity: "", unit: "", category: "" }],
    }));
  }

  function removeIngredient(index) {
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== index) }));
  }

  function updateStep(index, field, value) {
    setForm((f) => {
      const list = [...f.steps];
      list[index] = { ...list[index], [field]: value };
      return { ...f, steps: list };
    });
  }

  function addStep() {
    setForm((f) => ({ ...f, steps: [...f.steps, { text: "", timerSeconds: "" }] }));
  }

  function removeStep(index) {
    setForm((f) => ({ ...f, steps: f.steps.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.filter((i) => i.name.trim() !== ""),
        steps: form.steps
          .filter((s) => s.text.trim() !== "")
          .map((s) => ({
            text: s.text,
            timerSeconds: s.timerSeconds ? Number(s.timerSeconds) : null,
          })),
      };

      const saved = isEdit
        ? await recipeApi.update(id, payload)
        : await recipeApi.create(payload);

      navigate(`/recipes/${saved.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Editează rețeta" : "Rețetă nouă"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titlu *</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL imagine</label>
          <input
            className={inputClass}
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip masă</label>
            <select
              className={inputClass}
              value={form.mealType}
              onChange={(e) => updateField("mealType", e.target.value)}
            >
              <option value="breakfast">Mic dejun</option>
              <option value="lunch">Prânz</option>
              <option value="dinner">Cină</option>
              <option value="snack">Gustare</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dificultate</label>
            <select
              className={inputClass}
              value={form.difficulty}
              onChange={(e) => updateField("difficulty", e.target.value)}
            >
              <option value="easy">Ușor</option>
              <option value="medium">Mediu</option>
              <option value="hard">Dificil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Porții (bază)</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={form.servings}
              onChange={(e) => updateField("servings", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tip dietă</label>
          <div className="flex gap-3 flex-wrap">
            {DIET_CHOICES.map((diet) => (
              <label key={diet} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.dietTypes.includes(diet)}
                  onChange={() => toggleDiet(diet)}
                  className="accent-brand-600"
                />
                {diet}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timp preparare (min)
            </label>
            <input
              type="number"
              className={inputClass}
              value={form.prepTime}
              onChange={(e) => updateField("prepTime", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timp gătire (min)
            </label>
            <input
              type="number"
              className={inputClass}
              value={form.cookTime}
              onChange={(e) => updateField("cookTime", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Informații nutriționale (per porție)
          </label>
          <div className="grid grid-cols-4 gap-3">
            <input
              type="number"
              placeholder="Calorii"
              className={inputClass}
              value={form.calories}
              onChange={(e) => updateField("calories", e.target.value)}
            />
            <input
              type="number"
              placeholder="Proteine (g)"
              className={inputClass}
              value={form.protein}
              onChange={(e) => updateField("protein", e.target.value)}
            />
            <input
              type="number"
              placeholder="Carbo (g)"
              className={inputClass}
              value={form.carbs}
              onChange={(e) => updateField("carbs", e.target.value)}
            />
            <input
              type="number"
              placeholder="Grăsimi (g)"
              className={inputClass}
              value={form.fat}
              onChange={(e) => updateField("fat", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingrediente *</label>
          <div className="space-y-2">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2">
                <input
                  className={inputClass}
                  placeholder="Nume"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Cantitate"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Unitate (g, ml..)"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Categorie"
                  value={ing.category || ""}
                  onChange={(e) => updateIngredient(i, "category", e.target.value)}
                />
                {form.ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)} className="p-2 text-gray-400 hover:text-red-500">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addIngredient} className="mt-2 flex items-center gap-1 text-sm text-brand-600 hover:underline">
            <Plus size={16} /> Adaugă ingredient
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pași preparare *</label>
          <div className="space-y-2">
            {form.steps.map((step, i) => (
              <div key={i} className="grid grid-cols-[3fr_1fr_auto] gap-2">
                <input
                  className={inputClass}
                  placeholder={`Pasul ${i + 1}`}
                  value={step.text}
                  onChange={(e) => updateStep(i, "text", e.target.value)}
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Timer (sec)"
                  value={step.timerSeconds}
                  onChange={(e) => updateStep(i, "timerSeconds", e.target.value)}
                />
                {form.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)} className="p-2 text-gray-400 hover:text-red-500">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addStep} className="mt-2 flex items-center gap-1 text-sm text-brand-600 hover:underline">
            <Plus size={16} /> Adaugă pas
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-50"
          >
            {saving ? "Se salvează..." : "Salvează rețeta"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Anulează
          </button>
        </div>
      </form>
    </div>
  );
}

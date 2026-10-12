const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("rh_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ---------- Auth ----------
export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me", { auth: true }),
};

// ---------- Recipes ----------
export const recipeApi = {
  search: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    ).toString();
    return request(`/recipes${query ? `?${query}` : ""}`, { auth: true });
  },
  get: (id) => request(`/recipes/${id}`, { auth: true }),
  create: (payload) => request("/recipes", { method: "POST", body: payload, auth: true }),
  update: (id, payload) =>
    request(`/recipes/${id}`, { method: "PUT", body: payload, auth: true }),
  remove: (id) => request(`/recipes/${id}`, { method: "DELETE", auth: true }),
};

// ---------- Reviews ----------
export const reviewApi = {
  submit: (recipeId, payload) =>
    request(`/recipes/${recipeId}/reviews`, { method: "POST", body: payload, auth: true }),
  remove: (recipeId) =>
    request(`/recipes/${recipeId}/reviews`, { method: "DELETE", auth: true }),
};

// ---------- Favorites ----------
export const favoritesApi = {
  list: () => request("/favorites", { auth: true }),
  add: (recipeId) => request(`/favorites/${recipeId}`, { method: "POST", auth: true }),
  remove: (recipeId) => request(`/favorites/${recipeId}`, { method: "DELETE", auth: true }),
};

// ---------- History ----------
export const historyApi = {
  list: () => request("/history", { auth: true }),
  add: (recipeId) => request(`/history/${recipeId}`, { method: "POST", auth: true }),
  remove: (id) => request(`/history/${id}`, { method: "DELETE", auth: true }),
};

// ---------- Meal Planner ----------
export const mealPlanApi = {
  list: (weekStart) => request(`/meal-plan?weekStart=${weekStart}`, { auth: true }),
  add: (payload) => request("/meal-plan", { method: "POST", body: payload, auth: true }),
  move: (id, payload) => request(`/meal-plan/${id}`, { method: "PUT", body: payload, auth: true }),
  remove: (id) => request(`/meal-plan/${id}`, { method: "DELETE", auth: true }),
};

// ---------- Shopping List ----------
export const shoppingListApi = {
  get: () => request("/shopping-list", { auth: true }),
  generate: (recipes) =>
    request("/shopping-list/generate", { method: "POST", body: { recipes }, auth: true }),
  toggle: (id, checked) =>
    request(`/shopping-list/${id}`, { method: "PATCH", body: { checked }, auth: true }),
  removeItem: (id) => request(`/shopping-list/${id}`, { method: "DELETE", auth: true }),
  clear: (checkedOnly = false) =>
    request(`/shopping-list${checkedOnly ? "?checkedOnly=true" : ""}`, {
      method: "DELETE",
      auth: true,
    }),
};

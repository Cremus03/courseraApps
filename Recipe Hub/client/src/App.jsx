import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import RecipeForm from "./pages/RecipeForm.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import MealPlannerPage from "./pages/MealPlannerPage.jsx";
import ShoppingListPage from "./pages/ShoppingListPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route
          path="/recipes/new"
          element={<ProtectedRoute><RecipeForm /></ProtectedRoute>}
        />
        <Route
          path="/recipes/:id/edit"
          element={<ProtectedRoute><RecipeForm /></ProtectedRoute>}
        />
        <Route
          path="/favorites"
          element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
        />
        <Route
          path="/meal-plan"
          element={<ProtectedRoute><MealPlannerPage /></ProtectedRoute>}
        />
        <Route
          path="/shopping-list"
          element={<ProtectedRoute><ShoppingListPage /></ProtectedRoute>}
        />
      </Routes>
    </Layout>
  );
}

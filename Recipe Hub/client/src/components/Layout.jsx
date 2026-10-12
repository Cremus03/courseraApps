import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChefHat,
  Plus,
  Heart,
  CalendarDays,
  ShoppingCart,
  History,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 text-sm font-medium px-2.5 py-1.5 rounded-lg transition ${
          isActive ? "bg-white/20" : "hover:bg-white/10"
        }`
      }
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold shrink-0">
            <ChefHat size={26} />
            <span className="hidden md:inline">Recipe Hub</span>
          </Link>

          <nav className="flex items-center gap-1 flex-wrap">
            <NavItem to="/meal-plan" icon={<CalendarDays size={16} />} label="Meal Planner" />
            <NavItem to="/shopping-list" icon={<ShoppingCart size={16} />} label="Cumpărături" />
            {user && (
              <>
                <NavItem to="/favorites" icon={<Heart size={16} />} label="Favorite" />
                <NavItem to="/history" icon={<History size={16} />} label="Istoric" />
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  to="/recipes/new"
                  className="flex items-center gap-1 bg-white text-brand-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-50 transition"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Rețetă nouă</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/10"
                  title={`Delogare (${user.name})`}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 bg-white text-brand-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-50 transition"
              >
                <LogIn size={16} />
                Conectare
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="text-center text-sm text-gray-500 py-4">
        Recipe Hub &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

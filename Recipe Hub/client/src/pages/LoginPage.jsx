import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@recipehub.ro");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400";

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Conectare</h1>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parolă"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Se conectează..." : "Conectare"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Nu ai cont?{" "}
        <Link to="/register" className="text-brand-600 hover:underline">
          Înregistrează-te
        </Link>
      </p>
      <p className="text-xs text-gray-400 mt-3">
        Cont demo precompletat: demo@recipehub.ro / password123
      </p>
    </div>
  );
}

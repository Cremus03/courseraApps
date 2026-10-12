import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(email, password, name);
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
      <h1 className="text-xl font-bold text-gray-800 mb-4">Cont nou</h1>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Nume"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {loading ? "Se creează..." : "Creează cont"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Ai deja cont?{" "}
        <Link to="/login" className="text-brand-600 hover:underline">
          Conectează-te
        </Link>
      </p>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Wrong password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="mb-6">
          <div className="text-xs text-gray-500 tracking-widest uppercase font-bold mb-1">PROPOYE</div>
          <h1 className="text-2xl font-extrabold text-white">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your password to continue</p>
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full bg-gray-800 border border-white/10 text-white px-4 py-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/50 transition text-sm"
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading || !password}
          className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-xl transition text-sm"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </div>
    </div>
  );
}
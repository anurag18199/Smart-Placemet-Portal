import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getCurrentUser } from "../services/authService";
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      const { token } = res.data;
      localStorage.setItem("token", token);
      
      // fetch current user to get role
      const meRes = await getCurrentUser();
      const user = meRes.data.user;
      localStorage.setItem("role", user.role);
      
      if (user.role === "STUDENT") navigate("/student/dashboard");
      else if (user.role === "COMPANY") navigate("/company/dashboard");
      else if (user.role === "ADMIN") navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4">
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e0d8_1px,transparent_1px),linear-gradient(to_bottom,#e0e0d8_1px,transparent_1px)] bg-[size:40px_40px] opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-[#1a1a2e] text-xl font-semibold tracking-tight">PlacementPortal</span>
          </div>
          <p className="text-[#6b6b6b] text-sm">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm p-8">
          <h2 className="text-[#1a1a2e] text-2xl font-semibold mb-1">Welcome back</h2>
          <p className="text-[#9a9a9a] text-sm mb-6">Enter your credentials to continue</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[#3a3a3a]">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-medium py-2.5 rounded-lg text-sm transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#9a9a9a] mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#1a1a2e] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#b0b0b0] mt-6">
          © {new Date().getFullYear()} PlacementPortal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
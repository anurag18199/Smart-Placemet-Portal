import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT" as "STUDENT" | "COMPANY" | "ADMIN",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "STUDENT", label: "Student", desc: "Looking for placement opportunities" },
    { value: "COMPANY", label: "Company", desc: "Hiring students for roles" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4 py-10">
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
          <p className="text-[#6b6b6b] text-sm">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm p-8">
          <h2 className="text-[#1a1a2e] text-2xl font-semibold mb-1">Get started</h2>
          <p className="text-[#9a9a9a] text-sm mb-6">Fill in the details below to register</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value as any })}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition ${
                      form.role === r.value
                        ? "border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e]"
                        : "border-[#e0e0e0] text-[#6b6b6b] hover:border-[#c0c0c0]"
                    }`}
                  >
                    <div className="font-medium">{r.label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

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
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Password
              </label>
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#9a9a9a] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1a1a2e] font-medium hover:underline">
              Sign in
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
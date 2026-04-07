import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {  updateStudentProfile } from "../../services/studentService";
import { getCurrentUser } from "../../services/authService";
import type { StudentProfileInput } from "../../types/student";

const branches = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Other",
];

const currentYear = new Date().getFullYear();
const graduationYears = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

export default function StudentDashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [form, setForm] = useState<StudentProfileInput>({
    rollNumber: "",
    branch: "",
    cgpa: 0,
    graduationYear: currentYear,
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    resumeUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        console.log("User response:", userRes.data);
        const u = userRes.data.user;
        setUser(u);
  
        // Profile data comes from /auth/me
        const p = u.student; // Assuming backend sends student profile nested under user
  
        if (p && p.rollNumber) {
          setForm({
            rollNumber: p.rollNumber || "",
            branch: p.branch || "",
            cgpa: p.cgpa || 0,
            graduationYear: p.graduationYear || currentYear,
            phone: p.phone || "",
            linkedinUrl: p.linkedinUrl || "",
            githubUrl: p.githubUrl || "",
            resumeUrl: p.resumeUrl || "",
          });
          setProfileExists(true);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "cgpa" || name === "graduationYear" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateStudentProfile(form);
      setSuccess("Profile updated successfully!");
      setProfileExists(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white text-lg font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a2e]">{user?.name}</h1>
              <p className="text-sm text-[#9a9a9a]">{user?.email}</p>
            </div>
            {profileExists && (
              <span className="ml-auto text-xs px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full font-medium">
                Profile Complete
              </span>
            )}
            {!profileExists && (
              <span className="ml-auto text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">
                Profile Incomplete
              </span>
            )}
          </div>
          <p className="text-sm text-[#9a9a9a] mt-3">
            {profileExists
              ? "Your profile is set up. Keep it updated to improve your placement chances."
              : "Complete your profile before applying to jobs."}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">Academic Profile</h2>
          <p className="text-sm text-[#9a9a9a] mb-6">
            This information is shared with companies when you apply.
          </p>

          {success && (
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Roll Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. CS21B001"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Branch <span className="text-red-400">*</span>
                </label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                >
                  <option value="">Select branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Graduation Year <span className="text-red-400">*</span>
                </label>
                <select
                  name="graduationYear"
                  value={form.graduationYear}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                >
                  {graduationYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                CGPA <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="cgpa"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  min={0}
                  max={10}
                  step={0.01}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#9a9a9a]">
                  / 10
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#f0f0eb] pt-5">
              <p className="text-sm font-medium text-[#3a3a3a] mb-4">
                Links{" "}
                <span className="text-[#9a9a9a] font-normal">(optional)</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={form.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={form.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={form.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-medium px-6 py-2.5 rounded-lg text-sm transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : profileExists ? "Update Profile" : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Stats — only show if profile is complete */}
        {profileExists && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Branch", value: form.branch },
              { label: "CGPA", value: `${form.cgpa} / 10` },
              { label: "Graduation", value: form.graduationYear },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#e5e5e0] rounded-xl p-4 text-center"
              >
                <p className="text-lg font-semibold text-[#1a1a2e]">{stat.value}</p>
                <p className="text-xs text-[#9a9a9a] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
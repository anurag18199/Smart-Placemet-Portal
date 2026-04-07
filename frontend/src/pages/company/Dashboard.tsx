import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getCompanyProfile, updateCompanyProfile } from "../../services/companyService";
import { getCurrentUser } from "../../services/authService";
import type { CompanyProfileInput } from "../../types/company";

const industries = [
  "Information Technology",
  "Software Development",
  "Finance & Banking",
  "Consulting",
  "E-Commerce",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Telecommunications",
  "Media & Entertainment",
  "Other",
];

export default function CompanyDashboard() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<CompanyProfileInput>({
    companyName: "",
    description: "",
    industry: "",
    website: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.data.user);

        const profileRes = await getCompanyProfile();
        const profileData = profileRes.data.profile ?? profileRes.data.company;
        // if (profileData) { p = profileData; }
      
        if (profileData) {
          const p = profileData;
          setForm({
            companyName: p.companyName || "",
            description: p.description || "",
            industry: p.industry || "",
            website: p.website || "",
            location: p.location || "",
            phone: p.phone || "",
          });
          setIsApproved(p.isApproved || p.approved || false);
          setProfileExists(true);
        }
      } catch (err) {
        // profile not created yet — fine
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateCompanyProfile(form);
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
              {form.companyName
                ? form.companyName.charAt(0).toUpperCase()
                : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a2e]">
                {form.companyName || user?.name}
              </h1>
              <p className="text-sm text-[#9a9a9a]">{user?.email}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {profileExists ? (
                isApproved ? (
                  <span className="text-xs px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full font-medium">
                    ✓ Approved
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">
                    Pending Approval
                  </span>
                )
              ) : (
                <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">
                  Profile Incomplete
                </span>
              )}
            </div>
          </div>

          {profileExists && !isApproved && (
            <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              Your company is awaiting admin approval. You won't be able to post jobs until approved.
            </div>
          )}

          {profileExists && isApproved && (
            <p className="text-sm text-[#9a9a9a] mt-3">
              Your company is approved. You can post jobs and manage applicants.
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">Company Profile</h2>
          <p className="text-sm text-[#9a9a9a] mb-6">
            This information is shown to students on your job listings.
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
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Technologies"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

            {/* Industry + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Industry <span className="text-red-400">*</span>
                </label>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                >
                  <option value="">Select industry</option>
                  {industries.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, India"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                />
              </div>
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Website{" "}
                  <span className="text-[#9a9a9a] font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Company Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell students about your company, culture, and what you do..."
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition resize-none"
              />
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

        {/* Quick Stats */}
        {profileExists && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Industry", value: form.industry },
              { label: "Location", value: form.location },
              { label: "Status", value: isApproved ? "Approved" : "Pending" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#e5e5e0] rounded-xl p-4 text-center"
              >
                <p
                  className={`text-lg font-semibold ${
                    stat.label === "Status" && !isApproved
                      ? "text-amber-500"
                      : stat.label === "Status" && isApproved
                      ? "text-green-600"
                      : "text-[#1a1a2e]"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[#9a9a9a] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { createJob } from "../../services/jobService";
import { getCompanyProfile } from "../../services/companyService";
import type { CreateJobInput } from "../../types/job";

export default function CreateJob() {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateJobInput>({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "FULLTIME",
    minCgpa: 0,
    deadline: "",
  });

  useEffect(() => {
    const checkApproval = async () => {
        try {
          const res = await getCompanyProfile();
          console.log("Full response:", res.data);
          // handle both field names just in case
          const profile = res.data.profile ?? res.data.company;
          const approved = profile?.approved ?? profile?.isApproved ?? false;
          setIsApproved(approved);
        } catch (err: any) {
          console.error("Profile fetch error:", err.response?.data);
          setIsApproved(false);
        } finally {
          setChecking(false);
        }
      };
    checkApproval();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "minCgpa" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createJob(form);
      setSuccess("Job posted successfully!");
      setTimeout(() => navigate("/jobs"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  // Block unapproved companies
  if (!isApproved) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="bg-white border border-[#e5e5e0] rounded-2xl p-10 shadow-sm">
            <p className="text-4xl mb-4">⏳</p>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">
              Awaiting Admin Approval
            </h2>
            <p className="text-sm text-[#9a9a9a] mb-6">
              Your company needs to be approved by an admin before you can post
              jobs. This usually takes 24–48 hours.
            </p>
            <button
              onClick={() => navigate("/company/dashboard")}
              className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Post a Job</h1>
          <p className="text-sm text-[#9a9a9a] mt-1">
            Fill in the details below to post a new job listing.
          </p>
        </div>

        <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm p-8">
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

            {/* Row: Location + Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Salary <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹8 LPA or ₹20,000/month"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                />
              </div>
            </div>

            {/* Row: Job Type + Min CGPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Job Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                >
                  <option value="FULLTIME">Full Time</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Minimum CGPA <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="minCgpa"
                    value={form.minCgpa}
                    onChange={handleChange}
                    min={0}
                    max={10}
                    step={0.1}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#9a9a9a]">
                    / 10
                  </span>
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Application Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Job Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, requirements, and any other relevant details..."
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-medium px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
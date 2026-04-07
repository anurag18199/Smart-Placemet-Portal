import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getJobById, applyToJob } from "../../services/jobService";
import type { Job } from "../../types/job";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getJobById(id!);
        setJob(res.data.job);
      } catch {
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await applyToJob(id!);
      setApplied(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const isExpired = (deadline: string) => new Date(deadline) < new Date();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!job) return null;

  const expired = isExpired(job.deadline);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/jobs")}
          className="text-sm text-[#9a9a9a] hover:text-[#1a1a2e] mb-6 flex items-center gap-1 transition"
        >
          ← Back to Jobs
        </button>

        {/* Header Card */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {job.company.companyName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#1a1a2e]">
                  {job.title}
                </h1>
                <p className="text-sm text-[#6b6b6b] mt-0.5">
                  {job.company.companyName}
                </p>
              </div>
            </div>

            <span
              className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 ${
                job.jobType === "FULLTIME"
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-purple-50 text-purple-600 border border-purple-100"
              }`}
            >
              {job.jobType === "FULLTIME" ? "Full Time" : "Internship"}
            </span>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#f5f5f0]">
            {[
              { icon: "📍", label: "Location", value: job.location },
              { icon: "💰", label: "Salary", value: job.salary },
              { icon: "🎓", label: "Min CGPA", value: `${job.minCgpa} / 10` },
              {
                icon: "📅",
                label: "Deadline",
                value: formatDate(job.deadline),
                highlight: expired ? "text-red-500" : "text-[#1a1a2e]",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-[#9a9a9a] mb-1">
                  {item.icon} {item.label}
                </p>
                <p
                  className={`text-sm font-medium ${
                    item.highlight || "text-[#1a1a2e]"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          {role === "STUDENT" && (
            <div className="mt-5">
              {error && (
                <p className="text-sm text-red-500 mb-3">{error}</p>
              )}
              {applied ? (
                <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm font-medium">
                  ✓ Application submitted successfully!
                </div>
              ) : expired ? (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm font-medium">
                  This job listing has expired
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {applying ? "Submitting..." : "Apply Now"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="text-base font-semibold text-[#1a1a2e] mb-3">
            Job Description
          </h2>
          <p className="text-sm text-[#6b6b6b] leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* About Company */}
        <div className="bg-white border border-[#e5e5e0] rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#1a1a2e] mb-3">
            About {job.company.companyName}
          </h2>
          <p className="text-sm text-[#6b6b6b] leading-relaxed">
            {job.company.description}
          </p>
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-sm text-[#1a1a2e] font-medium underline underline-offset-2 hover:text-[#2a2a4e]"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </Layout>
  );
}
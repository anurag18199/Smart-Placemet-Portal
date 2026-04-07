import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getAllJobs } from "../../services/jobService";
import type { Job } from "../../types/job";

export default function JobsListing() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAllJobs({
        page,
        limit: 9,
        search: search || undefined,
        location: location || undefined,
        jobType: jobType || undefined,
        active: activeOnly,
      });
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setTotalJobs(res.data.totalJobs);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleClear = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setActiveOnly(true);
    setTimeout(() => fetchJobs(1), 0);
  };

  const isDeadlineSoon = (deadline: string) => {
    const diff =
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff >= 0;
  };

  const isExpired = (deadline: string) => new Date(deadline) < new Date();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Browse Jobs</h1>
          <p className="text-sm text-[#9a9a9a] mt-1">
            {totalJobs} opportunities available
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="bg-white border border-[#e5e5e0] rounded-2xl p-5 mb-6 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title..."
              className="px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-sm text-[#1a1a2e] placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
            />

            {/* Location */}
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by location..."
              className="px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-sm text-[#1a1a2e] placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
            />

            {/* Job Type */}
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
            >
              <option value="">All Types</option>
              <option value="FULLTIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
            </select>

            {/* Active toggle + buttons */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-[#6b6b6b] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  className="rounded border-[#e0e0e0] accent-[#1a1a2e]"
                />
                Active only
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-sm font-medium px-5 py-2 rounded-lg transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-[#6b6b6b] hover:text-[#1a1a2e] px-4 py-2 rounded-lg border border-[#e0e0e0] hover:border-[#c0c0c0] transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-[#9a9a9a]">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-base font-medium text-[#3a3a3a]">No jobs found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="bg-white border border-[#e5e5e0] rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-[#c0c0c0] transition group"
              >
                {/* Company + Type */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-bold">
                    {job.company.companyName.charAt(0)}
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      job.jobType === "FULLTIME"
                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                        : "bg-purple-50 text-purple-600 border border-purple-100"
                    }`}
                  >
                    {job.jobType === "FULLTIME" ? "Full Time" : "Internship"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-[#1a1a2e] text-base group-hover:text-[#2a2a4e] transition line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-[#6b6b6b] mt-0.5">
                  {job.company.companyName}
                </p>

                {/* Meta */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#9a9a9a]">
                    <span>📍</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#9a9a9a]">
                    <span>💰</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#9a9a9a]">
                    <span>🎓</span>
                    <span>Min CGPA: {job.minCgpa}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="mt-4 pt-3 border-t border-[#f5f5f0] flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isExpired(job.deadline)
                        ? "text-red-400"
                        : isDeadlineSoon(job.deadline)
                        ? "text-amber-500"
                        : "text-[#9a9a9a]"
                    }`}
                  >
                    {isExpired(job.deadline)
                      ? "Expired"
                      : isDeadlineSoon(job.deadline)
                      ? `⚠ Closes ${formatDate(job.deadline)}`
                      : `Closes ${formatDate(job.deadline)}`}
                  </span>
                  <span className="text-xs text-[#1a1a2e] font-medium group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchJobs(currentPage - 1)}
              className="px-4 py-2 text-sm rounded-lg border border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a2e] hover:text-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchJobs(p)}
                className={`w-9 h-9 text-sm rounded-lg border transition ${
                  p === currentPage
                    ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                    : "border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchJobs(currentPage + 1)}
              className="px-4 py-2 text-sm rounded-lg border border-[#e0e0e0] text-[#6b6b6b] hover:border-[#1a1a2e] hover:text-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
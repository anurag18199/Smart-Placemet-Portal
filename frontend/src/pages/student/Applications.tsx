import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getStudentApplications } from "../../services/studentService";
import type { Application, ApplicationStatus } from "../../types/application";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  APPLIED: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  SELECTED: {
    label: "Selected ✓",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
  },
};

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStudentApplications();
        setApplications(res.data.applications);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered =
    filter === "ALL"
      ? applications
      : applications.filter((a) => a.status === filter);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Summary counts
  const counts = {
    ALL: applications.length,
    APPLIED: applications.filter((a) => a.status === "APPLIED").length,
    SHORTLISTED: applications.filter((a) => a.status === "SHORTLISTED").length,
    SELECTED: applications.filter((a) => a.status === "SELECTED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">
            My Applications
          </h1>
          <p className="text-sm text-[#9a9a9a] mt-1">
            Track all your job applications in one place.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(
            [
              { key: "APPLIED", label: "Applied", color: "text-blue-600" },
              {
                key: "SHORTLISTED",
                label: "Shortlisted",
                color: "text-amber-600",
              },
              { key: "SELECTED", label: "Selected", color: "text-green-600" },
              { key: "REJECTED", label: "Rejected", color: "text-red-500" },
            ] as const
          ).map((s) => (
            <div
              key={s.key}
              className="bg-white border border-[#e5e5e0] rounded-xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>
                {counts[s.key]}
              </p>
              <p className="text-xs text-[#9a9a9a] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white border border-[#e5e5e0] rounded-xl p-1 w-fit mb-6 flex-wrap">
          {(
            [
              { key: "ALL", label: "All" },
              { key: "APPLIED", label: "Applied" },
              { key: "SHORTLISTED", label: "Shortlisted" },
              { key: "SELECTED", label: "Selected" },
              { key: "REJECTED", label: "Rejected" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === tab.key
                  ? "bg-[#1a1a2e] text-white"
                  : "text-[#6b6b6b] hover:text-[#1a1a2e] hover:bg-[#f5f5f0]"
              }`}
            >
              {tab.label}{" "}
              <span className="opacity-60 text-xs">({counts[tab.key]})</span>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#e5e5e0] rounded-2xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-base font-medium text-[#3a3a3a]">
              No applications found
            </p>
            <p className="text-sm text-[#9a9a9a] mt-1 mb-6">
              {filter === "ALL"
                ? "You haven't applied to any jobs yet."
                : `No applications with status "${filter.toLowerCase()}".`}
            </p>
            {filter === "ALL" && (
              <button
                onClick={() => navigate("/jobs")}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
              >
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const status = statusConfig[app.status];
              const isExpired = new Date(app.job.deadline) < new Date();

              return (
                <div
                  key={app.id}
                  className="bg-white border border-[#e5e5e0] rounded-2xl p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left — Job Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                        {app.job.company.companyName.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-[#1a1a2e] text-base">
                            {app.job.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                              app.job.jobType === "FULLTIME"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-purple-50 text-purple-600 border-purple-100"
                            }`}
                          >
                            {app.job.jobType === "FULLTIME"
                              ? "Full Time"
                              : "Internship"}
                          </span>
                        </div>

                        <p className="text-sm text-[#6b6b6b] mt-0.5">
                          {app.job.company.companyName}
                        </p>

                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-[#9a9a9a] flex items-center gap-1">
                            📍 {app.job.location}
                          </span>
                          <span className="text-xs text-[#9a9a9a] flex items-center gap-1">
                            💰 {app.job.salary}
                          </span>
                          <span className="text-xs text-[#9a9a9a] flex items-center gap-1">
                            📅 Applied {formatDate(app.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right — Status + Deadline */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium border ${status.bg} ${status.text} ${status.border}`}
                      >
                        {status.label}
                      </span>
                      <span
                        className={`text-xs ${
                          isExpired ? "text-red-400" : "text-[#9a9a9a]"
                        }`}
                      >
                        {isExpired
                          ? "Deadline passed"
                          : `Closes ${formatDate(app.job.deadline)}`}
                      </span>
                    </div>
                  </div>

                  {/* Selected Banner */}
                  {app.status === "SELECTED" && (
                    <div className="mt-4 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                      🎉 Congratulations! You have been selected for this role.
                    </div>
                  )}

                  {/* Shortlisted Banner */}
                  {app.status === "SHORTLISTED" && (
                    <div className="mt-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                      You have been shortlisted. Watch out for further updates.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
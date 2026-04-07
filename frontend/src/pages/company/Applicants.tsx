import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
// import { getCompanyJobs } from "../../services/jobService";
import {
  getJobApplicants,
  updateApplicationStatus,
  getCompanyJobs,
} from "../../services/companyService";
import type { Job } from "../../types/job";
import type { ApplicationStatus, UpdateableStatus  } from "../../types/application";

interface Applicant {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  student: {
    id: string;
    rollNumber: string;
    branch: string;
    cgpa: number;
    graduationYear: number;
    phone: string;
    linkedinUrl?: string;
    githubUrl?: string;
    resumeUrl?: string;
    user: {
      name: string;
      email: string;
    };
  };
}

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
    label: "Selected",
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

export default function CompanyApplicants() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "ALL">("ALL");

  // Fetch company's own jobs
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCompanyJobs();
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetch();
  }, []);

  const handleSelectJob = async (jobId: string) => {
    setSelectedJobId(jobId);
    setFilterStatus("ALL");
    setLoadingApplicants(true);
    try {
      const res = await getJobApplicants(jobId);
      setApplicants(res.data.applications);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: UpdateableStatus
  ) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const filteredApplicants =
    filterStatus === "ALL"
      ? applicants
      : applicants.filter((a) => a.status === filterStatus);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const counts = {
    ALL: applicants.length,
    APPLIED: applicants.filter((a) => a.status === "APPLIED").length,
    SHORTLISTED: applicants.filter((a) => a.status === "SHORTLISTED").length,
    SELECTED: applicants.filter((a) => a.status === "SELECTED").length,
    REJECTED: applicants.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Applicants</h1>
          <p className="text-sm text-[#9a9a9a] mt-1">
            Select a job to view and manage applicants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Job List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#f0f0eb]">
                <h2 className="text-sm font-semibold text-[#1a1a2e]">
                  Your Job Listings
                </h2>
              </div>

              {loadingJobs ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-5 h-5 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <p className="text-2xl mb-2">💼</p>
                  <p className="text-sm text-[#9a9a9a]">No jobs posted yet.</p>
                  <button
                    onClick={() => navigate("/company/create-job")}
                    className="mt-3 text-xs text-[#1a1a2e] font-medium underline underline-offset-2"
                  >
                    Post a job
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#f5f5f0] max-h-[500px] overflow-y-auto">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => handleSelectJob(job.id)}
                      className={`w-full text-left px-4 py-4 transition hover:bg-[#fafafa] ${
                        selectedJobId === job.id
                          ? "bg-[#f5f5f0] border-l-2 border-[#1a1a2e]"
                          : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-[#1a1a2e] line-clamp-1">
                        {job.title}
                      </p>
                      <p className="text-xs text-[#9a9a9a] mt-0.5">
                        {job.location} ·{" "}
                        {job.jobType === "FULLTIME" ? "Full Time" : "Internship"}
                      </p>
                      <p className="text-xs text-[#9a9a9a] mt-0.5">
                        Closes {formatDate(job.deadline)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Applicants */}
          <div className="lg:col-span-2">
            {!selectedJobId ? (
              <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-3xl mb-2">👈</p>
                  <p className="text-sm font-medium text-[#3a3a3a]">
                    Select a job to view applicants
                  </p>
                </div>
              </div>
            ) : loadingApplicants ? (
              <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-[#1a1a2e] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm overflow-hidden">
                {/* Job Header */}
                <div className="p-5 border-b border-[#f0f0eb]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-[#1a1a2e]">
                        {selectedJob?.title}
                      </h2>
                      <p className="text-xs text-[#9a9a9a] mt-0.5">
                        {applicants.length} total applicant
                        {applicants.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {/* Summary Pills */}
                    <div className="flex gap-2 flex-wrap">
                      {counts.SHORTLISTED > 0 && (
                        <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full">
                          {counts.SHORTLISTED} shortlisted
                        </span>
                      )}
                      {counts.SELECTED > 0 && (
                        <span className="text-xs px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full">
                          {counts.SELECTED} selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1 mt-4 bg-[#f5f5f0] rounded-lg p-1 w-fit flex-wrap">
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
                        onClick={() => setFilterStatus(tab.key)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                          filterStatus === tab.key
                            ? "bg-white text-[#1a1a2e] shadow-sm"
                            : "text-[#9a9a9a] hover:text-[#1a1a2e]"
                        }`}
                      >
                        {tab.label} ({counts[tab.key]})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applicant Cards */}
                {filteredApplicants.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="text-sm text-[#9a9a9a]">
                      No applicants in this category.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f5f5f0] max-h-[520px] overflow-y-auto">
                    {filteredApplicants.map((app) => {
                      const status = statusConfig[app.status];
                      return (
                        <div key={app.id} className="p-5 hover:bg-[#fafafa] transition">
                          <div className="flex items-start justify-between gap-4">
                            {/* Student Info */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {app.student.user.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#1a1a2e]">
                                  {app.student.user.name}
                                </p>
                                <p className="text-xs text-[#9a9a9a]">
                                  {app.student.user.email}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                  <span className="text-xs text-[#6b6b6b]">
                                    🎓 CGPA:{" "}
                                    <span
                                      className={`font-medium ${
                                        app.student.cgpa >= 8
                                          ? "text-green-600"
                                          : app.student.cgpa >= 6
                                          ? "text-amber-600"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {app.student.cgpa}
                                    </span>
                                  </span>
                                  <span className="text-xs text-[#6b6b6b]">
                                    🏫 {app.student.branch}
                                  </span>
                                  <span className="text-xs text-[#6b6b6b]">
                                    📋 {app.student.rollNumber}
                                  </span>
                                </div>

                                {/* Links */}
                                <div className="flex gap-3 mt-2">
                                  {app.student.resumeUrl && (
                                    <a
                                      href={app.student.resumeUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-[#1a1a2e] font-medium underline underline-offset-2 hover:text-[#2a2a4e]"
                                    >
                                      Resume
                                    </a>
                                  )}
                                  {app.student.linkedinUrl && (
                                    <a
                                      href={app.student.linkedinUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-[#1a1a2e] font-medium underline underline-offset-2 hover:text-[#2a2a4e]"
                                    >
                                      LinkedIn
                                    </a>
                                  )}
                                  {app.student.githubUrl && (
                                    <a
                                      href={app.student.githubUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs text-[#1a1a2e] font-medium underline underline-offset-2 hover:text-[#2a2a4e]"
                                    >
                                      GitHub
                                    </a>
                                  )}
                                </div>

                                <p className="text-xs text-[#c0c0c0] mt-1.5">
                                  Applied {formatDate(app.appliedAt)}
                                </p>
                              </div>
                            </div>

                            {/* Status + Actions */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {/* Current Status Badge */}
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium border ${status.bg} ${status.text} ${status.border}`}
                              >
                                {status.label}
                              </span>

                              {/* Action Buttons */}
                              {app.status !== "SELECTED" &&
                                app.status !== "REJECTED" && (
                                  <div className="flex flex-col gap-1.5 w-full">
                                    {app.status !== "SHORTLISTED" && (
                                      <button
                                        disabled={updatingId === app.id}
                                        onClick={() =>
                                          handleStatusUpdate(
                                            app.id,
                                            "SHORTLISTED"
                                          )
                                        }
                                        className="text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg transition disabled:opacity-50 font-medium"
                                      >
                                        Shortlist
                                      </button>
                                    )}
                                    <button
                                      disabled={updatingId === app.id}
                                      onClick={() =>
                                        handleStatusUpdate(app.id, "SELECTED")
                                      }
                                      className="text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition disabled:opacity-50 font-medium"
                                    >
                                      Select
                                    </button>
                                    <button
                                      disabled={updatingId === app.id}
                                      onClick={() =>
                                        handleStatusUpdate(app.id, "REJECTED")
                                      }
                                      className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg transition disabled:opacity-50 font-medium"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}

                              {/* Final status — no more actions */}
                              {(app.status === "SELECTED" ||
                                app.status === "REJECTED") && (
                                <p className="text-xs text-[#c0c0c0]">
                                  No further actions
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  getDashboardStats,
  getAllStudents,
  getAllCompanies,
  approveCompany,
} from "../../services/adminService";
import type { DashboardStats, AdminStudent, AdminCompany } from "../../types/admin";

type Tab = "overview" | "students" | "companies";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, studentsRes, companiesRes] = await Promise.all([
          getDashboardStats(),
          getAllStudents(),
          getAllCompanies(),
        ]);
        setStats(statsRes.data.stats || statsRes.data);
        setStudents(studentsRes.data.students || studentsRes.data);
        setCompanies(companiesRes.data.companies || companiesRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleApprove = async (companyId: string) => {
    setApprovingId(companyId);
    try {
      await approveCompany(companyId);
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, isApproved: true } : c
        )
      );
    } catch (err) {
      console.error("Failed to approve company", err);
    } finally {
      setApprovingId(null);
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

  const statCards = [
    {
      label: "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: "🎓",
      color: "bg-blue-50 border-blue-100",
      textColor: "text-blue-700",
    },
    {
      label: "Total Companies",
      value: stats?.totalCompanies ?? 0,
      icon: "🏢",
      color: "bg-purple-50 border-purple-100",
      textColor: "text-purple-700",
    },
    {
      label: "Total Jobs",
      value: stats?.totalJobs ?? 0,
      icon: "💼",
      color: "bg-amber-50 border-amber-100",
      textColor: "text-amber-700",
    },
    {
      label: "Applications",
      value: stats?.totalApplications ?? 0,
      icon: "📄",
      color: "bg-green-50 border-green-100",
      textColor: "text-green-700",
    },
    {
      label: "Placements",
      value: stats?.totalPlacements ?? 0,
      icon: "✅",
      color: "bg-emerald-50 border-emerald-100",
      textColor: "text-emerald-700",
    },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "students", label: `Students (${students.length})` },
    { key: "companies", label: `Companies (${companies.length})` },
  ];

  const pendingCompanies = companies.filter((c) => !c.isApproved);
  const approvedCompanies = companies.filter((c) => c.isApproved);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Admin Dashboard</h1>
          <p className="text-sm text-[#9a9a9a] mt-1">
            Manage students, companies, and platform activity.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#e5e5e0] rounded-xl p-1 w-fit mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#1a1a2e] text-white"
                  : "text-[#6b6b6b] hover:text-[#1a1a2e] hover:bg-[#f5f5f0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className={`border rounded-xl p-5 ${s.color}`}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
                  <p className="text-xs text-[#6b6b6b] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Approvals */}
            <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#1a1a2e]">
                  Pending Approvals
                </h2>
                {pendingCompanies.length > 0 && (
                  <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">
                    {pendingCompanies.length} pending
                  </span>
                )}
              </div>

              {pendingCompanies.length === 0 ? (
                <div className="text-center py-8 text-[#9a9a9a]">
                  <p className="text-3xl mb-2">✓</p>
                  <p className="text-sm">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-4 bg-[#fafafa] border border-[#f0f0eb] rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-semibold">
                          {company.companyName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1a1a2e]">
                            {company.companyName}
                          </p>
                          <p className="text-xs text-[#9a9a9a]">
                            {company.industry} · {company.location}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApprove(company.id)}
                        disabled={approvingId === company.id}
                        className="text-sm bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white px-4 py-1.5 rounded-lg transition disabled:opacity-60"
                      >
                        {approvingId === company.id ? "Approving..." : "Approve"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
          <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#f0f0eb]">
              <h2 className="text-base font-semibold text-[#1a1a2e]">All Students</h2>
              <p className="text-sm text-[#9a9a9a] mt-0.5">
                {students.length} registered students
              </p>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-16 text-[#9a9a9a]">
                <p className="text-3xl mb-2">🎓</p>
                <p className="text-sm">No students registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-[#f0f0eb]">
                      {["Name", "Email", "Roll No", "Branch", "CGPA", "Grad Year"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-6 py-3 text-xs font-medium text-[#9a9a9a] uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f5f0]">
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-[#fafafa] transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-[#1a1a2e] flex items-center justify-center text-white text-xs font-semibold">
                              {student.user.name.charAt(0)}
                            </div>
                            <span className="font-medium text-[#1a1a2e]">
                              {student.user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#6b6b6b]">
                          {student.user.email}
                        </td>
                        <td className="px-6 py-4 text-[#6b6b6b]">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 text-[#6b6b6b]">
                          {student.branch}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-medium ${
                              student.cgpa >= 8
                                ? "text-green-600"
                                : student.cgpa >= 6
                                ? "text-amber-600"
                                : "text-red-500"
                            }`}
                          >
                            {student.cgpa}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#6b6b6b]">
                          {student.graduationYear}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === "companies" && (
          <div className="space-y-6">
            {/* Pending */}
            {pendingCompanies.length > 0 && (
              <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#f0f0eb] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#1a1a2e]">
                    Pending Approval
                  </h2>
                  <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">
                    {pendingCompanies.length} pending
                  </span>
                </div>
                <div className="divide-y divide-[#f5f5f0]">
                  {pendingCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-semibold">
                          {company.companyName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1a1a2e]">
                            {company.companyName}
                          </p>
                          <p className="text-xs text-[#9a9a9a]">
                            {company.industry} · {company.location} ·{" "}
                            {company.user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApprove(company.id)}
                        disabled={approvingId === company.id}
                        className="text-sm bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white px-4 py-1.5 rounded-lg transition disabled:opacity-60"
                      >
                        {approvingId === company.id ? "Approving..." : "Approve"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved */}
            <div className="bg-white border border-[#e5e5e0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#f0f0eb]">
                <h2 className="text-base font-semibold text-[#1a1a2e]">
                  Approved Companies
                </h2>
                <p className="text-sm text-[#9a9a9a] mt-0.5">
                  {approvedCompanies.length} approved
                </p>
              </div>

              {approvedCompanies.length === 0 ? (
                <div className="text-center py-16 text-[#9a9a9a]">
                  <p className="text-3xl mb-2">🏢</p>
                  <p className="text-sm">No approved companies yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#fafafa] border-b border-[#f0f0eb]">
                        {["Company", "Industry", "Location", "Contact", "Website"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-6 py-3 text-xs font-medium text-[#9a9a9a] uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f0]">
                      {approvedCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className="hover:bg-[#fafafa] transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-md bg-[#1a1a2e] flex items-center justify-center text-white text-xs font-semibold">
                                {company.companyName.charAt(0)}
                              </div>
                              <span className="font-medium text-[#1a1a2e]">
                                {company.companyName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6b6b6b]">
                            {company.industry}
                          </td>
                          <td className="px-6 py-4 text-[#6b6b6b]">
                            {company.location}
                          </td>
                          <td className="px-6 py-4 text-[#6b6b6b]">
                            {company.phone}
                          </td>
                          <td className="px-6 py-4">
                            {company.website ? (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#1a1a2e] underline underline-offset-2 text-xs hover:text-[#2a2a4e]"
                              >
                                Visit
                              </a>
                            ) : (
                              <span className="text-[#c0c0c0] text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
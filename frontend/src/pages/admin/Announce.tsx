import { useState } from "react";
import Layout from "../../components/Layout";
import { broadcastAnnouncement } from "../../services/notificationService";

export default function Announce() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    target: "ALL" as "ALL" | "STUDENT" | "COMPANY",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    setError("");

    try {
      await broadcastAnnouncement(form);
      setSuccess(
        `Announcement sent successfully to ${
          form.target === "ALL"
            ? "all users"
            : form.target === "STUDENT"
            ? "all students"
            : "all companies"
        }!`
      );
      setForm({ title: "", message: "", target: "ALL" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  const targets = [
    {
      value: "ALL",
      label: "Everyone",
      desc: "All students and companies",
      icon: "🌐",
    },
    {
      value: "STUDENT",
      label: "Students Only",
      desc: "All registered students",
      icon: "🎓",
    },
    {
      value: "COMPANY",
      label: "Companies Only",
      desc: "All registered companies",
      icon: "🏢",
    },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">
            Send Announcement
          </h1>
          <p className="text-sm text-[#9a9a9a] mt-1">
            Broadcast a notification to students, companies, or everyone.
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
            {/* Target Selector */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-2">
                Send to <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {targets.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() =>
                      setForm({ ...form, target: t.value as any })
                    }
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition ${
                      form.target === t.value
                        ? "border-[#1a1a2e] bg-[#1a1a2e]/5 text-[#1a1a2e]"
                        : "border-[#e0e0e0] text-[#6b6b6b] hover:border-[#c0c0c0]"
                    }`}
                  >
                    <div className="text-lg mb-1">{t.icon}</div>
                    <div className="font-medium text-xs">{t.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Campus Drive: Infosys visiting next week"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your announcement here..."
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] text-[#1a1a2e] text-sm placeholder-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={sending}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-medium px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Announcement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getNotifications,
  markAllAsRead,
  markOneAsRead,
} from "../services/notificationService";
import type { Notification, NotificationType } from "../types/notification";

const typeIcon: Record<NotificationType, string> = {
  APPLICATION_STATUS: "📄",
  NEW_JOB: "💼",
  ANNOUNCEMENT: "📢",
  COMPANY_APPROVED: "✅",
};

const typeLabel: Record<NotificationType, string> = {
  APPLICATION_STATUS: "Application Update",
  NEW_JOB: "New Job",
  ANNOUNCEMENT: "Announcement",
  COMPANY_APPROVED: "Company Approved",
};

const typeBadge: Record<NotificationType, string> = {
  APPLICATION_STATUS: "bg-blue-50 text-blue-600 border-blue-100",
  NEW_JOB: "bg-purple-50 text-purple-600 border-purple-100",
  ANNOUNCEMENT: "bg-amber-50 text-amber-600 border-amber-100",
  COMPANY_APPROVED: "bg-green-50 text-green-600 border-green-200",
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type FilterType = "ALL" | NotificationType;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [filter, setFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleMarkOne = async (id: string) => {
    await markOneAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAll = async () => {
    setMarking(true);
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } finally {
      setMarking(false);
    }
  };

  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const filters: { key: FilterType; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "APPLICATION_STATUS", label: "Applications" },
    { key: "NEW_JOB", label: "Jobs" },
    { key: "ANNOUNCEMENT", label: "Announcements" },
    { key: "COMPANY_APPROVED", label: "Approvals" },
  ];

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a1a2e]">
              Notifications
            </h1>
            <p className="text-sm text-[#9a9a9a] mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={marking}
              className="text-sm text-[#6b6b6b] hover:text-[#1a1a2e] border border-[#e0e0e0] hover:border-[#c0c0c0] px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {marking ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white border border-[#e5e5e0] rounded-xl p-1 w-fit mb-6 flex-wrap">
          {filters.map((tab) => {
            const count =
              tab.key === "ALL"
                ? notifications.length
                : notifications.filter((n) => n.type === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === tab.key
                    ? "bg-[#1a1a2e] text-white"
                    : "text-[#6b6b6b] hover:text-[#1a1a2e] hover:bg-[#f5f5f0]"
                }`}
              >
                {tab.label}{" "}
                <span className="opacity-60 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#e5e5e0] rounded-2xl">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-base font-medium text-[#3a3a3a]">
              No notifications here
            </p>
            <p className="text-sm text-[#9a9a9a] mt-1">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`bg-white border rounded-2xl p-5 transition ${
                  !n.read
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-[#e5e5e0]"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f0] flex items-center justify-center text-lg flex-shrink-0">
                    {typeIcon[n.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-[#1a1a2e]">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                          )}
                        </div>
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mt-1 ${
                            typeBadge[n.type]
                          }`}
                        >
                          {typeLabel[n.type]}
                        </span>
                      </div>

                      {/* Mark as read */}
                      {!n.read && (
                        <button
                          onClick={() => handleMarkOne(n.id)}
                          className="text-xs text-[#9a9a9a] hover:text-[#1a1a2e] flex-shrink-0 transition"
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-[#6b6b6b] mt-2 leading-relaxed">
                      {n.message}
                    </p>

                    <p className="text-xs text-[#c0c0c0] mt-2">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
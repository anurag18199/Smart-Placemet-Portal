import API from "./api";

export const getNotifications = () => {
  return API.get("/notifications");
};

export const markOneAsRead = (id: string) => {
  return API.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return API.patch("/notifications/read-all");
};

export const broadcastAnnouncement = (data: {
  title: string;
  message: string;
  target: "ALL" | "STUDENT" | "COMPANY";
}) => {
  return API.post("/notifications/announce", data);
};
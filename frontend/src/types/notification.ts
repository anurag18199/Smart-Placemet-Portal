export type NotificationType =
  | "APPLICATION_STATUS"
  | "NEW_JOB"
  | "ANNOUNCEMENT"
  | "COMPANY_APPROVED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
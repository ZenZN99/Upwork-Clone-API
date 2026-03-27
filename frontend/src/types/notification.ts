import type { IUser } from "./user";

export const NotificationTypes = {
  PROPOSAL: "Proposal",
  PAYMENT: "Payment",
  REVIEW: "Review",
  PAYMENT_RELEASED: "Payment Released",
  FROZEN: "Frozen",
} as const;

export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export interface INotification {
  _id: string;
  senderId: IUser;
  receiverId: string;
  type: NotificationType;
  target: string;
  isRead: boolean;
}

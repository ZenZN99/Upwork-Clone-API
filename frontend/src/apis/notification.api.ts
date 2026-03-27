import { BACKEND_URL } from "./user.api";

export const getMyNotifications = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/notification`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getUnreadCount = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/notification/unread-count`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const markAsRead = async (id: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/notification/${id}/read`, {
      method: "PUT",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const markAllAsRead = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/notification/read-all`, {
      method: "PATCH",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/notification/${notificationId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

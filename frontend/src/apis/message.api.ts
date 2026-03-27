import { BACKEND_URL } from "./user.api";

export const sendMessage = async (
  contractId: string,
  receiverId: string,
  content: string,
  image: string | null,
) => {
  const formData = new FormData();
  if (receiverId) formData.append("receiverId", receiverId);
  if (content) formData.append("content", content);
  if (image) formData.append("image", image);
  try {
    const res = await fetch(`${BACKEND_URL}/api/message/send/${contractId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getChatMessages = async (
  contractId: string,
  otherUserId: string,
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/message/chat/${contractId}/${otherUserId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/message/delete/${messageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const markMessageAsRead = async (
  senderId: string,
  contractId: string,
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/message/read/${senderId}/${contractId}`,
      {
        method: "PUT",
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

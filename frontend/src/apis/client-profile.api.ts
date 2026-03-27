import { BACKEND_URL } from "./user.api";

export const getClientProfile = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/client/profile`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateFreelancerProfile = async (
  companyName: string,
  bio: string,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/client/update/profile`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ companyName, bio }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

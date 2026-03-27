import { BACKEND_URL } from "./user.api";

export const getFreelancerProfile = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/freelancer/profile`, {
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
  jobTitle: string,
  bio: string,
  skills: string[],
  hourlyRate: string,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/freelancer/update/profile`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ jobTitle, bio, skills, hourlyRate }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

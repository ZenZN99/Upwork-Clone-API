import { BACKEND_URL } from "./user.api";

export const createReview = async (
  contractId: string,
  professionalism: number,
  communication: number,
  quality: number,
  expertise: number,
  delivery: number,
  rehire: number,
  comment: string,
  note?: string,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        contractId,
        professionalism,
        communication,
        quality,
        expertise,
        delivery,
        rehire,
        comment,
        note,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getFreelancerReviews = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/review/freelancer`, {
      method: "GET",

      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getClientReviews = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/review/client`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getReviewById = async (reviewId: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/review/review/${reviewId}`, {
      method: "GET",

      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/review/delete/${reviewId}`, {
      method: "DELETE",

      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

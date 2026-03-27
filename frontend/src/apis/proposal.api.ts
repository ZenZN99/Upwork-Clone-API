import type { ProposalStatus } from "../types/proposal";
import { BACKEND_URL } from "./user.api";

export const createProposal = async (
  projectId: string,
  price: number,
  durationDays: number,
  coverLetter: string,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/proposal/create/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ price, durationDays, coverLetter }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getProjectProposals = async (projectId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/proposal/proposals/${projectId}`,
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

export const getProposalsByFreelancer = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/proposal/freelancer`, {
      method: "GET",

      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateProposalStatus = async (
  proposalId: string,
  status: ProposalStatus,
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/proposal/update/status/${proposalId}`,
      {
        method: "PUT",

        credentials: "include",
        body: JSON.stringify({ status }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteProposal = async (proposalId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/proposal/delete/${proposalId}`,
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

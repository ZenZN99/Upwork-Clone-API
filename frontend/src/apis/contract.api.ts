import { BACKEND_URL } from "./user.api";

export const createContract = async (
  proposalId: string,
  agreedPrice: number,
  durationDays: number,
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/contract/create/${proposalId}`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ agreedPrice, durationDays }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateContract = async (
  contractId: string,
  agreedPrice: number,
  durationDays: number,
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/contract/update/${contractId}`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ agreedPrice, durationDays }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllContracts = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/contract/update/contracts`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getContractById = async (contractId: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/contract/${contractId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const completeContract = async (contractId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/contract/complete/${contractId}`,
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

export const cancelContract = async (contractId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/contract/cancel/${contractId}`,
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

export const deleteContract = async (contractId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/contract/delete/${contractId}`,
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

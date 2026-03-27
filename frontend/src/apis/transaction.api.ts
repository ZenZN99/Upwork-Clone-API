import { BACKEND_URL } from "./user.api";

export const freezeBalanceByProposal = async (
  proposalId: string,
) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/transaction/freeze/${proposalId}`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const releaseFrozenBalanceByProposal = async (proposalId: string) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/transaction/releas/${proposalId}`,
      {
        method: "POST",

        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const rechargeBalance = async (amount: number) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/transaction/recharge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

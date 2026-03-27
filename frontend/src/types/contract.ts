export const ContractStatuses = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type ContractStatus =
  (typeof ContractStatuses)[keyof typeof ContractStatuses];

export interface IContract {
  _id: string;
  projectId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  agreedPrice: number;
  durationDays: number;
  status: ContractStatus;
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

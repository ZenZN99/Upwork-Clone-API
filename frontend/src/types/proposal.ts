export const ProposalStatuses = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type ProposalStatus =
  (typeof ProposalStatuses)[keyof typeof ProposalStatuses];

export interface IProposal {
  _id: string;
  projectId: string;
  freelancerId: string;
  price: number;
  durationDays: number;
  coverLetter: string;
  status: ProposalStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

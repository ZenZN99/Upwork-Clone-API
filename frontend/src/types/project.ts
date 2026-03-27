export const BudgetTypes = {
  FIXED: "FIXED",
  HOURLY: "HOURLY",
} as const;

export type BudgetType = (typeof BudgetTypes)[keyof typeof BudgetTypes];

export const ProjectStatuses = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
} as const;

export type ProjectStatus =
  (typeof ProjectStatuses)[keyof typeof ProjectStatuses];

export interface IProject {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  budgetType: BudgetType;
  budget: number;
  status: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

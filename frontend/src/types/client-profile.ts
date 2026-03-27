export const CompanyNames = {
  INDIVIDUAL: "Individual",
  STARTUP: "Startup",
  SMALL_BUSINESS: "Small Business",
  AGENCY: "Agency",
  ENTERPRISE: "Enterprise",
  NON_PROFIT: "Non Profit",
  OTHER: "Other",
} as const;

export type CompanyName = (typeof CompanyNames)[keyof typeof CompanyNames];

export interface IClient {
  _id: string;
  clientId: string;
  companyName: CompanyName;
  bio: string;
  totalSpent: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

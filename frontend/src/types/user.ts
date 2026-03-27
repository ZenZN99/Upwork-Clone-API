export const UserRoles = {
  ADMIN: "Admin",
  FREELANCER: "Freelancer",
  CLIENT: "Client",
} as const;
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  balance?: number;
  frozenBalance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

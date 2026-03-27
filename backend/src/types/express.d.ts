import { User } from "src/schemas/user.schema";
import { AuthUser } from "./auth-user.interface";

export interface RequestWithUser {
  user: AuthUser;
}
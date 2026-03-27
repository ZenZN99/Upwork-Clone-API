import { UserRole } from 'src/enums/user.enum';

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  role: UserRole;
}
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from 'src/enums/user.enum';

@Injectable()
export class FreelancerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    if (user.role !== UserRole.FREELANCER) {
      throw new ForbiddenException('Only freelancers can access this resource');
    }

    return true;
  }
}

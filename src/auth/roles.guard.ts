//helps in determining the role of the user, this guard is used together with the auth guard
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private role: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const emp = request.emp;

    if (!emp || emp.role !== this.role) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['jwt'];

    if (!token) {
      throw new UnauthorizedException('Authentication Required');
    }

    try {
      const payload = this.jwtService.verify(token); // decode JWT
      request.emp = payload; //attach payload to request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

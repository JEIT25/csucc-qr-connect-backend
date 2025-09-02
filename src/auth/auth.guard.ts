/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext){
    const request = context.switchToHttp().getRequest();

      try {
          const jwt = request.cookies['jwt'];
          return this.jwtService.verify(jwt);
      } catch (err) {
          return false;
    }
  }
}

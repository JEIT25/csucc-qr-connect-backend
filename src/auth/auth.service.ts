import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createJwt(user: User) {
    //creates the jwt using user_id
    const jwt = await this.jwtService.signAsync({
      id: user.user_id,
    });

    return jwt;
  }
}

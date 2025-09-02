import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async createJwt(user: User) {
    //creates the jwt using user_id
    const jwt = await this.jwtService.signAsync({
      user_id: user.user_id,
      role: user.role,
    });

    return jwt;
  }

  async decryptJwt(cookie: string) {
    const { user_id, role } = await this.jwtService.verifyAsync(cookie); //get the decrpyted value of the cookie(id and role of user)
    return {
      user_id: user_id,
      role: role,
    };
  }
}

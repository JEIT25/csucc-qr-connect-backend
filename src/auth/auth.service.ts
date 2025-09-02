import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async login(dto: LoginUserDto) {
    const user = await this.userService.findOneBy({ email: dto.email });

    if (!user) {
      throw new NotFoundException('Account was not found.');
    }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException('Account credentials did not match our records.');
    }

    const jwt = await this.jwtService.signAsync({
      id: user.user_id,
    });

    return jwt;
  }
}

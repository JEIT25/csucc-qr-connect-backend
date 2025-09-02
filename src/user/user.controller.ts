import { Body, Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('admins/users/create')
export class UserController {
  createUser(@Body() body: CreateUserDto) {
    return body;
  }
}

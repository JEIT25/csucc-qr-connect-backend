import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(User);

    const saltRounds = 12;

    const hashpw = await bcrypt.hash('password', saltRounds);

    await repo.insert([
      {
        lname: 'Admin',
        fname: 'User',
        email: 'admin@example.com',
        password: hashpw,
        role: UserRole.ADMIN,
      },
    ]);
  }
}

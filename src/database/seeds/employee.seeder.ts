import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employee/employee.entity';
import * as bcrypt from 'bcrypt';

export enum EmpRole {
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export default class EmployeeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Employee);

    const saltRounds = 12;

    const hashpw = await bcrypt.hash('password', saltRounds);

    await repo.insert([
      {
        lastname: 'Ketchum',
        firstname: 'Ash',
        email: 'ash.ketchum@csucc.edu.ph',
        password: hashpw,
        role: EmpRole.ADMIN,
      },
    ]);

    await repo.insert([
      {
        lastname: 'Juan',
        firstname: 'Cruz',
        email: 'juan.cruz@csucc.edu.ph',
        password: hashpw,
        role: EmpRole.INSTRUCTOR,
      },
    ]);

    await repo.insert([
      {
        lastname: 'Jeit',
        firstname: 'Dev',
        email: 'jeit.dev@csucc.edu.ph',
        password: hashpw,
        role: EmpRole.INSTRUCTOR,
      },
    ]);
  }
}

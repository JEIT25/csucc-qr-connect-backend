import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { AbstractService } from 'src/shared/abstract.service';

@Injectable()
export class EmployeeService extends AbstractService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
  ) {
    super(employeeRepository);
  }
}

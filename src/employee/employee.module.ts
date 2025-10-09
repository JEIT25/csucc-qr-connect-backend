import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';

@Module({
  controllers: [EmployeeController],
  imports: [TypeOrmModule.forFeature([Employee])],
  exports: [EmployeeService],
  providers: [EmployeeService],
})
export class EmployeeModule {}

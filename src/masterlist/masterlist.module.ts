import { Module } from '@nestjs/common';
import { MasterlistController } from './masterlist.controller';
import { MasterlistService } from './masterlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Masterlist } from './masterlist.entity';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [TypeOrmModule.forFeature([Masterlist]), EmployeeModule],
  controllers: [MasterlistController],
  providers: [MasterlistService],
  exports: [MasterlistService],
})
export class MasterlistModule {}

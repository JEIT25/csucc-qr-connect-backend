import { Module } from '@nestjs/common';
import { MasterlistController } from './masterlist.controller';
import { MasterlistService } from './masterlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Masterlist } from './masterlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Masterlist])],
  controllers: [MasterlistController],
  providers: [MasterlistService],
})
export class MasterlistModule {}

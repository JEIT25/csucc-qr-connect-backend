import { Module } from '@nestjs/common';
import { MasterlistMemberController } from './masterlist-member.controller';
import { MasterlistMemberService } from './masterlist-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterlistMember } from './masterlist-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MasterlistMember])],
  controllers: [MasterlistMemberController],
  providers: [MasterlistMemberService],
})
export class MasterlistMemberModule {}

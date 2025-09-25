import { Module } from '@nestjs/common';
import { MasterlistMemberController } from './masterlist-member.controller';
import { MasterlistMemberService } from './masterlist-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterlistMember } from './masterlist-member.entity';
import { MasterlistModule } from 'src/masterlist/masterlist.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([MasterlistMember]), StudentModule, MasterlistModule],
  controllers: [MasterlistMemberController],
  providers: [MasterlistMemberService],
})
export class MasterlistMemberModule {}

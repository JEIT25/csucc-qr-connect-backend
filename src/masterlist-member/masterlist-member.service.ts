import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterlistMember } from './masterlist-member.entity';
import { AbstractService } from '../shared/abstract.service';

@Injectable()
export class MasterlistMemberService extends AbstractService {
  constructor(
    @InjectRepository(MasterlistMember)
    private readonly memberRepository: Repository<MasterlistMember>,
  ) {
    super(memberRepository);
  }
}

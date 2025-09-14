import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Masterlist } from './masterlist.entity';
import { AbstractService } from '../shared/abstract.service';

@Injectable()
export class MasterlistService extends AbstractService {
  constructor(
    @InjectRepository(Masterlist) private readonly masterlistRepository: Repository<Masterlist>,
  ) {
    super(masterlistRepository);
  }

  async findOneWithMembers(masterlist_id: number) {
    return this.masterlistRepository.findOne({
      where: { masterlist_id: masterlist_id },
      relations: ['attendance', 'masterlist_members', 'masterlist_members.student'],
      // masterlistMembers is the relation to MasterlistMember
      // student is the relation inside MasterlistMember
    });
  }
}

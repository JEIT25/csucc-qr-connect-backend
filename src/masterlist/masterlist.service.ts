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

  // async findOneWithMembers(masterlist_id: number) {
  //   return this.masterlistRepository.findOne({
  //     where: { masterlist_id: masterlist_id },
  //     relations: ['attendance', 'masterlist_members', 'masterlist_members.student'],
  //     // masterlistMembers is the relation to MasterlistMember
  //     // student is the relation inside MasterlistMember
  //   });
  // }

  // 1.For Admin - Get all masterlists including assigned instructor
  async findAllWithInstructors() {
    return this.masterlistRepository.find({
      relations: ['employee'],
      order: { sy: 'DESC', sem: 'DESC' },
    });
  }

  // 2.For Instructor - Get only the instructor's assigned masterlists
  async findByInstructor(empid: number) {
    return this.masterlistRepository.find({
      where: { empid },
      relations: ['employee'],
      order: { sy: 'DESC', sem: 'DESC' },
    });
  }
}

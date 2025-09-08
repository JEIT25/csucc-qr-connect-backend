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
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { AbstractService } from '../shared/abstract.service';

@Injectable()
export class StudentService extends AbstractService {
  constructor(@InjectRepository(Student) private readonly studentRepository: Repository<Student>) {
    super(studentRepository);
  }
}

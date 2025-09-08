import { Repository } from 'typeorm';

//this class contains generic CRUD functions for finding data in database
//will be used by many services
export abstract class AbstractService {
  protected constructor(private readonly repository: Repository<any>) {}

  async save(validData: any) {
    return await this.repository.save(validData);
  }

  async findOneBy(validData: any) {
    return await this.repository.findOneBy(validData);
  }

  async find(validData: any) {
    return await this.repository.find(validData);
  }

  async update(id: number, validData: any) {
    return await this.repository.update(id, validData);
  }

  async delete(id: number) {
    return await this.repository.delete(id);
  }
}

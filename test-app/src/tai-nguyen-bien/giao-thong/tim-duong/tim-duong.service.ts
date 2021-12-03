import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimDuongEntity } from './tim-duong.entity';

@Injectable()
export class TimDuongService extends TypeOrmCrudService<TimDuongEntity> {
  constructor(@InjectRepository(TimDuongEntity) repo) {
    super(repo);
  }
}

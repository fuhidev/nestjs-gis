import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMCapDiTichEntity } from './dm-cap-di-tich.entity';

@Injectable()
export class DMCapDiTichService extends TypeOrmCrudService<DMCapDiTichEntity> {
  constructor(@InjectRepository(DMCapDiTichEntity) repo) {
    super(repo);
  }
}

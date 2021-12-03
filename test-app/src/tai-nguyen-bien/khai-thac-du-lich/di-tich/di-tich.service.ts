import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiTichEntity } from './di-tich.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DiTichService extends GISTypeOrmCrudService<DiTichEntity> {
  constructor(@InjectRepository(DiTichEntity) repo) {
    super(repo);
  }
}

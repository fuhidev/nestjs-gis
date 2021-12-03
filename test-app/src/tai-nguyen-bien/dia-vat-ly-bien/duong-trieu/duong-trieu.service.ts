import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuongTrieuEntity } from './duong-trieu.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DuongTrieuService extends GISTypeOrmCrudService<DuongTrieuEntity> {
  constructor(@InjectRepository(DuongTrieuEntity) repo) {
    super(repo);
  }
}

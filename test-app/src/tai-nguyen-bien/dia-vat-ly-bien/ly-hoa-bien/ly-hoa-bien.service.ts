import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LyHoaBienEntity } from './ly-hoa-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class LyHoaBienService extends GISTypeOrmCrudService<LyHoaBienEntity> {
  constructor(@InjectRepository(LyHoaBienEntity) repo) {
    super(repo);
  }
}

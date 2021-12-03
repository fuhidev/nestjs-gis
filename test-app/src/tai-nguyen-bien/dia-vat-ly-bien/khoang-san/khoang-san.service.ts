import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KhoangSanEntity } from './khoang-san.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class KhoangSanService extends GISTypeOrmCrudService<KhoangSanEntity> {
  constructor(@InjectRepository(KhoangSanEntity) repo) {
    super(repo);
  }
}

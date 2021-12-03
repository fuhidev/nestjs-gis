import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DauKhiBienEntity } from './dau-khi-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DauKhiBienService extends GISTypeOrmCrudService<DauKhiBienEntity> {
  constructor(@InjectRepository(DauKhiBienEntity) repo) {
    super(repo);
  }
}

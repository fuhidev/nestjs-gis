import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuongDinhBoEntity } from './duong-dinh-bo.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DuongDinhBoService extends GISTypeOrmCrudService<
  DuongDinhBoEntity
> {
  constructor(@InjectRepository(DuongDinhBoEntity) repo) {
    super(repo);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuongDangSauEntity } from './duong-dang-sau.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DuongDangSauService extends GISTypeOrmCrudService<
  DuongDangSauEntity
> {
  constructor(@InjectRepository(DuongDangSauEntity) repo) {
    super(repo);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NhanChimBienEntity } from './nhan-chim-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class NhanChimBienService extends GISTypeOrmCrudService<
  NhanChimBienEntity
> {
  constructor(@InjectRepository(NhanChimBienEntity) repo) {
    super(repo);
  }
}

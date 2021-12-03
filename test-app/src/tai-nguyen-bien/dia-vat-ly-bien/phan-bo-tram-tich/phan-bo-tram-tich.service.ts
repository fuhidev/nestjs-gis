import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhanBoTramTichEntity } from './phan-bo-tram-tich.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class PhanBoTramTichService extends GISTypeOrmCrudService<
  PhanBoTramTichEntity
> {
  constructor(@InjectRepository(PhanBoTramTichEntity) repo) {
    super(repo);
  }
}

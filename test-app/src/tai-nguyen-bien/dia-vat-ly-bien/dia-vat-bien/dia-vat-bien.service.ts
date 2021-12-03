import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaVatBienEntity } from './dia-vat-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DiaVatBienService extends GISTypeOrmCrudService<DiaVatBienEntity> {
  constructor(@InjectRepository(DiaVatBienEntity) repo) {
    super(repo);
  }
}

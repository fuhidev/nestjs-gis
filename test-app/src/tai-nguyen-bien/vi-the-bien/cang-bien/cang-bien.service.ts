import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CangBienEntity } from './cang-bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class CangBienService extends GISTypeOrmCrudService<CangBienEntity> {
  constructor(@InjectRepository(CangBienEntity) repo) {
    super(repo);
  }
}

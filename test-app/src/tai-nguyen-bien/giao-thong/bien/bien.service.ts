import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BienEntity } from './bien.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class BienService extends GISTypeOrmCrudService<BienEntity> {
  constructor(@InjectRepository(BienEntity) repo) {
    super(repo);
  }
}

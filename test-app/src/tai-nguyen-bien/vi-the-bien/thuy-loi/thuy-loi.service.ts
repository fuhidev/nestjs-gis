import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThuyLoiEntity } from './thuy-loi.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class ThuyLoiService extends GISTypeOrmCrudService<ThuyLoiEntity> {
  constructor(@InjectRepository(ThuyLoiEntity) repo) {
    super(repo);
  }
}

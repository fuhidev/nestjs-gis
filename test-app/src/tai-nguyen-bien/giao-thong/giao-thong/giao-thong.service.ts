import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiaoThongEntity } from './giao-thong.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class GiaoThongService extends GISTypeOrmCrudService<GiaoThongEntity> {
  constructor(@InjectRepository(GiaoThongEntity) repo) {
    super(repo);
  }
}

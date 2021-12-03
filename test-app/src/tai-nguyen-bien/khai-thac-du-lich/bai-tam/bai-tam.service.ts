import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaiTamEntity } from './bai-tam.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class BaiTamService extends GISTypeOrmCrudService<BaiTamEntity> {
  constructor(@InjectRepository(BaiTamEntity) repo) {
    super(repo);
  }
}

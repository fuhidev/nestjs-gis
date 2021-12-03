import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KhuVucONhiemEntity } from './khu-vuc-o-nhiem.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class KhuVucONhiemService extends GISTypeOrmCrudService<
  KhuVucONhiemEntity
> {
  constructor(@InjectRepository(KhuVucONhiemEntity) repo) {
    super(repo);
  }
}

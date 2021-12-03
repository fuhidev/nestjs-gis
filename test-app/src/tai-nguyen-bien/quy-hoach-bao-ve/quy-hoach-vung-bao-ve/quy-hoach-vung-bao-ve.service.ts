import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuyHoachVungBaoVeEntity } from './quy-hoach-vung-bao-ve.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class QuyHoachVungBaoVeService extends GISTypeOrmCrudService<
  QuyHoachVungBaoVeEntity
> {
  constructor(@InjectRepository(QuyHoachVungBaoVeEntity) repo) {
    super(repo);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuyHoachPhatTrienDuLichEntity } from './quy-hoach-phat-trien-du-lich.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class QuyHoachPhatTrienDuLichService extends GISTypeOrmCrudService<
  QuyHoachPhatTrienDuLichEntity
> {
  constructor(@InjectRepository(QuyHoachPhatTrienDuLichEntity) repo) {
    super(repo);
  }
}

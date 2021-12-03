import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuyHoachAnNinhQuocPhongEntity } from './quy-hoach-an-ninh-quoc-phong.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class QuyHoachAnNinhQuocPhongService extends GISTypeOrmCrudService<
  QuyHoachAnNinhQuocPhongEntity
> {
  constructor(@InjectRepository(QuyHoachAnNinhQuocPhongEntity) repo) {
    super(repo);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KhaiThacTaiNguyenDatEntity } from './khai-thac-tai-nguyen-dat.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class KhaiThacTaiNguyenDatService extends GISTypeOrmCrudService<
  KhaiThacTaiNguyenDatEntity
> {
  constructor(@InjectRepository(KhaiThacTaiNguyenDatEntity) repo) {
    super(repo);
  }
}

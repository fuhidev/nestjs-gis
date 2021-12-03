import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DaDangSinhHocThuySanEntity } from './da-dang-sinh-hoc-thuy-san.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class DaDangSinhHocThuySanService extends GISTypeOrmCrudService<
  DaDangSinhHocThuySanEntity
> {
  constructor(@InjectRepository(DaDangSinhHocThuySanEntity) repo) {
    super(repo);
  }
}

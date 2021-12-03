import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiKhuVucDichVuEntity } from './dm-loai-khu-vuc-dich-vu.entity';

@Injectable()
export class DMLoaiKhuVucDichVuService extends TypeOrmCrudService<
  DMLoaiKhuVucDichVuEntity
> {
  constructor(@InjectRepository(DMLoaiKhuVucDichVuEntity) repo) {
    super(repo);
  }
}

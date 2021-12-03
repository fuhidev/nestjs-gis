import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiThachQuyenEntity } from './dm-loai-thach-quyen.entity';

@Injectable()
export class DMLoaiThachQuyenService extends TypeOrmCrudService<
  DMLoaiThachQuyenEntity
> {
  constructor(@InjectRepository(DMLoaiThachQuyenEntity) repo) {
    super(repo);
  }
}

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMLoaiMatGiaoThongEntity } from './dm-loai-mat-giao-thong.entity';

@Injectable()
export class DMLoaiMatGiaoThongService extends TypeOrmCrudService<
  DMLoaiMatGiaoThongEntity
> {
  constructor(@InjectRepository(DMLoaiMatGiaoThongEntity) repo) {
    super(repo);
  }
}

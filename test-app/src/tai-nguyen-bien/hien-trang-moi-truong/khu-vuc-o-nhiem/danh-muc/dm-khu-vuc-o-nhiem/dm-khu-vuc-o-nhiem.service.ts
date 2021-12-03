import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMKhuVucONhiemEntity } from './dm-khu-vuc-o-nhiem.entity';

@Injectable()
export class DMKhuVucONhiemService extends TypeOrmCrudService<
  DMKhuVucONhiemEntity
> {
  constructor(@InjectRepository(DMKhuVucONhiemEntity) repo) {
    super(repo);
  }
}

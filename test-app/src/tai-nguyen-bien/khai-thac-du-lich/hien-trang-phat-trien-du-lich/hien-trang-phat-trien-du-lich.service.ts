import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HienTrangPhatTrienDuLichEntity } from './hien-trang-phat-trien-du-lich.entity';
import { GISTypeOrmCrudService } from 'nestjs-gis';
@Injectable()
export class HienTrangPhatTrienDuLichService extends GISTypeOrmCrudService<
  HienTrangPhatTrienDuLichEntity
> {
  constructor(@InjectRepository(HienTrangPhatTrienDuLichEntity) repo) {
    super(repo);
  }
}

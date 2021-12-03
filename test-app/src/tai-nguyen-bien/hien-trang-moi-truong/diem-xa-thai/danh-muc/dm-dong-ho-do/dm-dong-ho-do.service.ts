import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMDongHoDoEntity } from './dm-dong-ho-do.entity';

@Injectable()
export class DMDongHoDoService extends TypeOrmCrudService<DMDongHoDoEntity> {
  constructor(@InjectRepository(DMDongHoDoEntity) repo) {
    super(repo);
  }
}

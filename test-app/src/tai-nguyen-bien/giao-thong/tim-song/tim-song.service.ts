import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimSongEntity } from './tim-song.entity';

@Injectable()
export class TimSongService extends TypeOrmCrudService<TimSongEntity> {
  constructor(@InjectRepository(TimSongEntity) repo) {
    super(repo);
  }
}

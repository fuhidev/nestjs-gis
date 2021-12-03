import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimSongController } from './tim-song.controller';
import { TimSongEntity } from './tim-song.entity';
import { TimSongService } from './tim-song.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimSongEntity])],
  providers: [TimSongService],
  controllers: [TimSongController],
})
export class TimSongModule {}

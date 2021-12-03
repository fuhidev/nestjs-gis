import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimDuongController } from './tim-duong.controller';
import { TimDuongEntity } from './tim-duong.entity';
import { TimDuongService } from './tim-duong.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimDuongEntity])],
  providers: [TimDuongService],
  controllers: [TimDuongController],
})
export class TimDuongModule {}

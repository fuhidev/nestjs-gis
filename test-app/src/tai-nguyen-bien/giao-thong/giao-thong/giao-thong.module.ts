import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiaoThongController } from './giao-thong.controller';
import { GiaoThongEntity } from './giao-thong.entity';
import { GiaoThongService } from './giao-thong.service';

@Module({
  imports: [TypeOrmModule.forFeature([GiaoThongEntity])],
  providers: [GiaoThongService],
  controllers: [GiaoThongController],
})
export class GiaoThongModule {}

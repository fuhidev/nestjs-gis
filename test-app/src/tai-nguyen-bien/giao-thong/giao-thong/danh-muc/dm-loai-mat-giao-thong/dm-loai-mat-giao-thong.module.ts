import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMLoaiMatGiaoThongController } from './dm-loai-mat-giao-thong.controller';
import { DMLoaiMatGiaoThongEntity } from './dm-loai-mat-giao-thong.entity';
import { DMLoaiMatGiaoThongService } from './dm-loai-mat-giao-thong.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiMatGiaoThongEntity])],
  providers: [DMLoaiMatGiaoThongService],
  controllers: [DMLoaiMatGiaoThongController],
})
export class DmLoaiMatGiaoThongModule {}

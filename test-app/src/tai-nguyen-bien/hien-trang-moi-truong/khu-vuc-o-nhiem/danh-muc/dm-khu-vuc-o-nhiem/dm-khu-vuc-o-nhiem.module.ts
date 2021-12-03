import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMKhuVucONhiemController } from './dm-khu-vuc-o-nhiem.controller';
import { DMKhuVucONhiemEntity } from './dm-khu-vuc-o-nhiem.entity';
import { DMKhuVucONhiemService } from './dm-khu-vuc-o-nhiem.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMKhuVucONhiemEntity])],
  providers: [DMKhuVucONhiemService],
  controllers: [DMKhuVucONhiemController],
})
export class DmKhuVucONhiemModule {}

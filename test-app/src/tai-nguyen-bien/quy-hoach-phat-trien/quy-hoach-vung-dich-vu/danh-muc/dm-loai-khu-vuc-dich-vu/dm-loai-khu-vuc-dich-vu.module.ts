import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMLoaiKhuVucDichVuController } from './dm-loai-khu-vuc-dich-vu.controller';
import { DMLoaiKhuVucDichVuEntity } from './dm-loai-khu-vuc-dich-vu.entity';
import { DMLoaiKhuVucDichVuService } from './dm-loai-khu-vuc-dich-vu.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiKhuVucDichVuEntity])],
  providers: [DMLoaiKhuVucDichVuService],
  controllers: [DMLoaiKhuVucDichVuController],
})
export class DmLoaiKhuVucDichVuModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiKhuVucDichVuModule } from './danh-muc/dm-loai-khu-vuc-dich-vu/dm-loai-khu-vuc-dich-vu.module';
import { QuyHoachVungDichVuController } from './quy-hoach-vung-dich-vu.controller';
import { QuyHoachAnNinhQuocPhongEntity } from './quy-hoach-vung-dich-vu.entity';
import { QuyHoachVungDichVuService } from './quy-hoach-vung-dich-vu.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuyHoachAnNinhQuocPhongEntity]),
    DmLoaiKhuVucDichVuModule,
  ],
  providers: [QuyHoachVungDichVuService],
  controllers: [QuyHoachVungDichVuController],
})
export class QuyHoachVungDichVuModule {}

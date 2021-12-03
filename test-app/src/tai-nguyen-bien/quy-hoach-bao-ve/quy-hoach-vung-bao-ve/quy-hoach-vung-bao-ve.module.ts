import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiKhuBaoVeModule } from './danh-muc/dm-loai-khu-bao-ve/dm-loai-khu-bao-ve.module';
import { QuyHoachVungBaoVeController } from './quy-hoach-vung-bao-ve.controller';
import { QuyHoachVungBaoVeEntity } from './quy-hoach-vung-bao-ve.entity';
import { QuyHoachVungBaoVeService } from './quy-hoach-vung-bao-ve.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuyHoachVungBaoVeEntity]),DmLoaiKhuBaoVeModule],
  providers: [QuyHoachVungBaoVeService],
  controllers: [QuyHoachVungBaoVeController],
})
export class QuyHoachVungBaoVeModule {}

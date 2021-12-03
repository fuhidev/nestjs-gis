import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMLoaiThachQuyenController } from './dm-loai-thach-quyen.controller';
import { DMLoaiThachQuyenEntity } from './dm-loai-thach-quyen.entity';
import { DMLoaiThachQuyenService } from './dm-loai-thach-quyen.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiThachQuyenEntity])],
  providers: [DMLoaiThachQuyenService],
  controllers: [DMLoaiThachQuyenController],
})
export class DMLoaiThachQuyenModule {}

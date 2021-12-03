import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMLoaiThuyQuyenController } from './dm-loai-thuy-quyen.controller';
import { DMLoaiThuyQuyenEntity } from './dm-loai-thuy-quyen.entity';
import { DMLoaiThuyQuyenService } from './dm-loai-thuy-quyen.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiThuyQuyenEntity])],
  providers: [DMLoaiThuyQuyenService],
  controllers: [DMLoaiThuyQuyenController],
})
export class DMLoaiThuyQuyenModule {}

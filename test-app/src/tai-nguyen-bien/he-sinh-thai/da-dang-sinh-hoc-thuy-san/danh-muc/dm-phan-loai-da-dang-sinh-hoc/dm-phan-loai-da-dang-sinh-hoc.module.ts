import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMPhanLoaiDaDangSinhHocController } from './dm-phan-loai-da-dang-sinh-hoc.controller';
import { DMPhanLoaiDDSH } from './dm-phan-loai-da-dang-sinh-hoc.entity';
import { DMPhanLoaiDaDangSinhHocService } from './dm-phan-loai-da-dang-sinh-hoc.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMPhanLoaiDDSH])],
  providers: [DMPhanLoaiDaDangSinhHocService],
  controllers: [DMPhanLoaiDaDangSinhHocController],
})
export class DMPhanLoaiDaDangSinhHocModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMPhanLoaiController } from './dm-phan-loai.controller';
import { DMGiaiDoanEntity } from './dm-phan-loai.entity';
import { DMPhanLoaiService } from './dm-phan-loai.service';

@Module({
imports: [
  TypeOrmModule.forFeature([DMGiaiDoanEntity])],
  providers: [DMPhanLoaiService],
  controllers: [DMPhanLoaiController],
})
export class DMGiaiDoanModule { }

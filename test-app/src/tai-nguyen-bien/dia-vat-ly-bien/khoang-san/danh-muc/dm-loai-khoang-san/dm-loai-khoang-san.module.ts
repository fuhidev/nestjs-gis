import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMLoaiKhoangSanController } from './dm-loai-khoang-san.controller';
import { DMLoaiKhoangSanEntity } from './dm-loai-khoang-san.entity';
import { DMLoaiKhoangSanService } from './dm-loai-khoang-san.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiKhoangSanEntity])],
  providers: [DMLoaiKhoangSanService],
  controllers: [DMLoaiKhoangSanController],
})
export class DMLoaiKhoangSanModule {}

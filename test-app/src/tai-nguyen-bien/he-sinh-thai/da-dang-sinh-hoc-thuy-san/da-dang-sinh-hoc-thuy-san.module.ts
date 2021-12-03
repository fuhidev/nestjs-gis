import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaDangSinhHocThuySanController } from './da-dang-sinh-hoc-thuy-san.controller';
import { DaDangSinhHocThuySanEntity } from './da-dang-sinh-hoc-thuy-san.entity';
import { DaDangSinhHocThuySanService } from './da-dang-sinh-hoc-thuy-san.service';
import { DMPhanLoaiDaDangSinhHocModule } from './danh-muc/dm-phan-loai-da-dang-sinh-hoc/dm-phan-loai-da-dang-sinh-hoc.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaDangSinhHocThuySanEntity]),
    DMPhanLoaiDaDangSinhHocModule,
  ],
  providers: [DaDangSinhHocThuySanService],
  controllers: [DaDangSinhHocThuySanController],
})
export class DaDangSinhHocThuySanModule {}

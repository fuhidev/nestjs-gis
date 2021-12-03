import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMLoaiKhoangSanModule } from './danh-muc/dm-loai-khoang-san/dm-loai-khoang-san.module';
import { KhoangSanController } from './khoang-san.controller';
import { KhoangSanEntity } from './khoang-san.entity';
import { KhoangSanService } from './khoang-san.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhoangSanEntity]), DMLoaiKhoangSanModule],
  providers: [KhoangSanService],
  controllers: [KhoangSanController],
})
export class KhoangSanModule {}

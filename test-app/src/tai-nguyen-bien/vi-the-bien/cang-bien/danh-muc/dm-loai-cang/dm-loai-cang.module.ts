import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiCangController } from './dm-loai-cang.controller';
import { DMLoaiCangEntity } from './dm-loai-cang.entity';
import { DmLoaiCangService } from './dm-loai-cang.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiCangEntity])],
  providers: [DmLoaiCangService],
  controllers: [DmLoaiCangController]
})
export class DmLoaiCangModule { }

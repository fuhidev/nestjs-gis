import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiDuongTrieuController } from './dm-loai-duong-trieu.controller';
import { DMLoaiDuongTrieuEntity } from './dm-loai-duong-trieu.entity';
import { DmLoaiDuongTrieuService } from './dm-loai-duong-trieu.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiDuongTrieuEntity])],
  providers: [DmLoaiDuongTrieuService],
  controllers: [DmLoaiDuongTrieuController]
})
export class DmLoaiDuongTrieuModule { }

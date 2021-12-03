import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiKhuBaoVeController } from './dm-loai-khu-bao-ve.controller';
import { DmLoaiKhuBaoVeEntity } from './dm-loai-khu-bao-ve.entity';
import { DmLoaiKhuBaoVeService } from './dm-loai-khu-bao-ve.service';

@Module({
  imports: [TypeOrmModule.forFeature([DmLoaiKhuBaoVeEntity])],
  providers: [DmLoaiKhuBaoVeService],
  controllers: [DmLoaiKhuBaoVeController]
})
export class DmLoaiKhuBaoVeModule { }

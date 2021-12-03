import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CangBienController } from './cang-bien.controller';
import { CangBienEntity } from './cang-bien.entity';
import { CangBienService } from './cang-bien.service';
import { DmLoaiCangModule } from './danh-muc/dm-loai-cang/dm-loai-cang.module';

@Module({
  imports: [TypeOrmModule.forFeature([CangBienEntity]), DmLoaiCangModule],
  providers: [CangBienService],
  controllers: [CangBienController],
})
export class CangBienModule {}

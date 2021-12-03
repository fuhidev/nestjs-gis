import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiDamPhaController } from './dm-loai-dam-pha.controller';
import { DMLoaiDamPhaEntity } from './dm-loai-dam-pha.entity';
import { DmLoaiDamPhaService } from './dm-loai-dam-pha.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMLoaiDamPhaEntity])],
  providers: [DmLoaiDamPhaService],
  controllers: [DmLoaiDamPhaController],
})
export class DmLoaiDamPhaModule {}

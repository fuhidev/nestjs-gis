import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmLoaiDuongTrieuModule } from './danh-muc/dm-loai-duong-trieu/dm-loai-duong-trieu.module';
import { DuongTrieuController } from './duong-trieu.controller';
import { DuongTrieuEntity } from './duong-trieu.entity';
import { DuongTrieuService } from './duong-trieu.service';

@Module({
  imports: [TypeOrmModule.forFeature([DuongTrieuEntity]),DmLoaiDuongTrieuModule],
  providers: [DuongTrieuService],
  controllers: [DuongTrieuController],
})
export class DuongTrieuModule {}

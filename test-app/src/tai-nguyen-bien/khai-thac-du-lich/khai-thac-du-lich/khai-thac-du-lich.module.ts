import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhaiThacDuLichController } from './khai-thac-du-lich.controller';
import { KhaiThacDuLichEntity } from './khai-thac-du-lich.entity';
import { KhaiThacDuLichService } from './khai-thac-du-lich.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhaiThacDuLichEntity])],
  providers: [KhaiThacDuLichService],
  controllers: [KhaiThacDuLichController],
})
export class KhaiThacDuLichModule {}

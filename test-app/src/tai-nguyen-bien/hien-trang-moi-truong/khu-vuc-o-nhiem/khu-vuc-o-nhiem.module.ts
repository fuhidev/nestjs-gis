import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmKhuVucONhiemModule } from './danh-muc/dm-khu-vuc-o-nhiem/dm-khu-vuc-o-nhiem.module';
import { KhuVucONhiemController } from './khu-vuc-o-nhiem.controller';
import { KhuVucONhiemEntity } from './khu-vuc-o-nhiem.entity';
import { KhuVucONhiemService } from './khu-vuc-o-nhiem.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KhuVucONhiemEntity]),
    DmKhuVucONhiemModule,
  ],
  providers: [KhuVucONhiemService],
  controllers: [KhuVucONhiemController],
})
export class KhuVucONhiemModule {}

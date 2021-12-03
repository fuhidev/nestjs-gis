import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuyHoachAnNinhQuocPhongController } from './quy-hoach-an-ninh-quoc-phong.controller';
import { QuyHoachAnNinhQuocPhongEntity } from './quy-hoach-an-ninh-quoc-phong.entity';
import { QuyHoachAnNinhQuocPhongService } from './quy-hoach-an-ninh-quoc-phong.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuyHoachAnNinhQuocPhongEntity])],
  providers: [QuyHoachAnNinhQuocPhongService],
  controllers: [QuyHoachAnNinhQuocPhongController],
})
export class QuyHoachAnNinhQuocPhongModule {}

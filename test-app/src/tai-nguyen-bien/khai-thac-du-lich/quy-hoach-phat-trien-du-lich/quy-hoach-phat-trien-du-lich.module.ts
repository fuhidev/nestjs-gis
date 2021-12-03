import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuyHoachPhatTrienDuLichController } from './quy-hoach-phat-trien-du-lich.controller';
import { QuyHoachPhatTrienDuLichEntity } from './quy-hoach-phat-trien-du-lich.entity';
import { QuyHoachPhatTrienDuLichService } from './quy-hoach-phat-trien-du-lich.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuyHoachPhatTrienDuLichEntity])],
  providers: [QuyHoachPhatTrienDuLichService],
  controllers: [QuyHoachPhatTrienDuLichController],
})
export class QuyHoachPhatTrienDuLichModule {}

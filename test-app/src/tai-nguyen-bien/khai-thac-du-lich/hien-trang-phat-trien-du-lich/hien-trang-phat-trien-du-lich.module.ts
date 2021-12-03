import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HienTrangPhatTrienDuLichController } from './hien-trang-phat-trien-du-lich.controller';
import { HienTrangPhatTrienDuLichEntity } from './hien-trang-phat-trien-du-lich.entity';
import { HienTrangPhatTrienDuLichService } from './hien-trang-phat-trien-du-lich.service';

@Module({
  imports: [TypeOrmModule.forFeature([HienTrangPhatTrienDuLichEntity])],
  providers: [HienTrangPhatTrienDuLichService],
  controllers: [HienTrangPhatTrienDuLichController],
})
export class HienTrangPhatTrienDuLichModule {}

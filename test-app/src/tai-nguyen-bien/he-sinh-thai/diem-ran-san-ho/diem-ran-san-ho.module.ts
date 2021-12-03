import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiemRanSanHoController } from './diem-ran-san-ho.controller';
import { DiemRanSanHoEntity } from './diem-ran-san-ho.entity';
import { DiemRanSanHoService } from './diem-ran-san-ho.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiemRanSanHoEntity])],
  providers: [DiemRanSanHoService],
  controllers: [DiemRanSanHoController],
})
export class DiemRanSanHoModule {}

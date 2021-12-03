import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NuoiTrongThuySanTrenBienController } from './nuoi-trong-thuy-san-tren-bien.controller';
import { NuoiTrongThuySanTrenBienEntity } from './nuoi-trong-thuy-san-tren-bien.entity';
import { NuoiTrongThuySanTrenBienService } from './nuoi-trong-thuy-san-tren-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([NuoiTrongThuySanTrenBienEntity])],
  providers: [NuoiTrongThuySanTrenBienService],
  controllers: [NuoiTrongThuySanTrenBienController]
})
export class NuoiTrongThuySanTrenBienModule { }

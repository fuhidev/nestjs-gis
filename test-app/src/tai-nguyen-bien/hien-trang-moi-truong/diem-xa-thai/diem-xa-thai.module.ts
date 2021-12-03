import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMDongHoDoModule } from './danh-muc/dm-dong-ho-do/dm-dong-ho-do.module';
import { DiemXaThaiController } from './diem-xa-thai.controller';
import { DiemXaThaiEntity } from './diem-xa-thai.entity';
import { DiemXaThaiService } from './diem-xa-thai.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiemXaThaiEntity]), DMDongHoDoModule],
  providers: [DiemXaThaiService],
  controllers: [DiemXaThaiController],
})
export class DiemXaThaiModule {}

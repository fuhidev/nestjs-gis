import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMDongHoDoController } from './dm-dong-ho-do.controller';
import { DMDongHoDoEntity } from './dm-dong-ho-do.entity';
import { DMDongHoDoService } from './dm-dong-ho-do.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMDongHoDoEntity])],
  providers: [DMDongHoDoService],
  controllers: [DMDongHoDoController],
})
export class DMDongHoDoModule {}

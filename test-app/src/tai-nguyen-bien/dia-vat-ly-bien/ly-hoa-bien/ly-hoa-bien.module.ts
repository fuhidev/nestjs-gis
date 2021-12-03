import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LyHoaBienController } from './ly-hoa-bien.controller';
import { LyHoaBienEntity } from './ly-hoa-bien.entity';
import { LyHoaBienService } from './ly-hoa-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([LyHoaBienEntity])],
  providers: [LyHoaBienService],
  controllers: [LyHoaBienController],
})
export class LyHoaBienModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViTheBienController } from './vi-the-bien.controller';
import { ViTheBienEntity } from './vi-the-bien.entity';
import { ViTheBienService } from './vi-the-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([ViTheBienEntity])],
  providers: [ViTheBienService],
  controllers: [ViTheBienController],
})
export class ViTheBienModule {}

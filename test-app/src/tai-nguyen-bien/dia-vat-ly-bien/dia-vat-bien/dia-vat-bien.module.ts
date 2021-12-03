import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaVatBienController } from './dia-vat-bien.controller';
import { DiaVatBienEntity } from './dia-vat-bien.entity';
import { DiaVatBienService } from './dia-vat-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaVatBienEntity])],
  providers: [DiaVatBienService],
  controllers: [DiaVatBienController],
})
export class DiaVatBienModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMCapDiTichController } from './dm-cap-di-tich.controller';
import { DMCapDiTichEntity } from './dm-cap-di-tich.entity';
import { DMCapDiTichService } from './dm-cap-di-tich.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMCapDiTichEntity])],
  providers: [DMCapDiTichService],
  controllers: [DMCapDiTichController],
})
export class DmCapDiTichModule {}

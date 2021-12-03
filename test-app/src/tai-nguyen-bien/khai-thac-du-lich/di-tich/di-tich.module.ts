import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmCapDiTichModule } from './danh-muc/dm-cap-di-tich/dm-cap-di-tich.module';
import { DiTichController } from './di-tich.controller';
import { DiTichEntity } from './di-tich.entity';
import { DiTichService } from './di-tich.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiTichEntity]), DmCapDiTichModule],
  providers: [DiTichService],
  controllers: [DiTichController],
})
export class DiTichModule {}

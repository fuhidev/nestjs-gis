import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DuongDinhBoController } from './duong-dinh-bo.controller';
import { DuongDinhBoEntity } from './duong-dinh-bo.entity';
import { DuongDinhBoService } from './duong-dinh-bo.service';

@Module({
  imports: [TypeOrmModule.forFeature([DuongDinhBoEntity])],
  providers: [DuongDinhBoService],
  controllers: [DuongDinhBoController],
})
export class DuongDinhBoModule {}

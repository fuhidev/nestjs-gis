import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DuongDangSauController } from './duong-dang-sau.controller';
import { DuongDangSauEntity } from './duong-dang-sau.entity';
import { DuongDangSauService } from './duong-dang-sau.service';

@Module({
  imports: [TypeOrmModule.forFeature([DuongDangSauEntity])],
  providers: [DuongDangSauService],
  controllers: [DuongDangSauController],
})
export class DuongDangSauModule {}

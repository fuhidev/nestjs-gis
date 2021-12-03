import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DuongBoController } from './duong-bo.controller';
import { DuongBoEntity } from './duong-bo.entity';
import { DuongBoService } from './duong-bo.service';

@Module({
  imports: [TypeOrmModule.forFeature([DuongBoEntity])],
  providers: [DuongBoService],
  controllers: [DuongBoController]
})
export class DuongBoModule { }

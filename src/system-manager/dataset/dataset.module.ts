import { Module } from '@nestjs/common';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetEntity } from './dataset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatasetEntity])],
  controllers: [DatasetController],
  providers: [DatasetService],
  exports:[TypeOrmModule]
})
export class DatasetModule { }

import { Module } from '@nestjs/common';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetEntity } from './dataset.entity';
import { CONNECT_NAME } from '../system-manager.constant';

@Module({
  imports: [TypeOrmModule.forFeature([DatasetEntity])],
  controllers: [DatasetController],
  providers: [DatasetService],
  exports:[TypeOrmModule]
})
export class DatasetModule { }

import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerEntity } from './logger.entity';
import { LoggerActionTypeEntity } from './logger-action-type.entity';
import { LoggerActionTypeService } from './logger.action-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoggerEntity, LoggerActionTypeEntity])
  ],
  controllers: [LoggerController],
  providers: [LoggerService, LoggerActionTypeService],
  exports: [TypeOrmModule, LoggerService, LoggerActionTypeService]
})
export class LoggerModule { }

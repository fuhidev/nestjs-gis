import { Module } from '@nestjs/common';
import { ApplicationGroupController } from './application-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationGroupEntity } from './application-group.entity';
import { ApplicationGroupService } from './application-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationGroupEntity])],
  controllers: [ApplicationGroupController],
  providers:[ApplicationGroupService],
  exports: [TypeOrmModule]
})
export class ApplicationGroupModule { }

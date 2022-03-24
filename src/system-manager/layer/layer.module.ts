import { Module } from '@nestjs/common';
import { LayerController } from './layer.controller';
import { LayerService } from './layer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LayerEntity } from './layer.entity';
import { SYSColumnEntity } from '../column';

@Module({
  imports: [TypeOrmModule.forFeature([LayerEntity, SYSColumnEntity])],
  controllers: [LayerController],
  providers: [LayerService],
  exports: [TypeOrmModule, LayerService],
})
export class LayerModule {}

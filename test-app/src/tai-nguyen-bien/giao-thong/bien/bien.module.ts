import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BienController } from './bien.controller';
import { BienEntity } from './bien.entity';
import { BienService } from './bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([BienEntity])],
  providers: [BienService],
  controllers: [BienController],
})
export class BienModule {}

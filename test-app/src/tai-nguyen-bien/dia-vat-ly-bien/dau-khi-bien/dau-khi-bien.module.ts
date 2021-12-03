import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DauKhiBienController } from './dau-khi-bien.controller';
import { DauKhiBienEntity } from './dau-khi-bien.entity';
import { DauKhiBienService } from './dau-khi-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([DauKhiBienEntity])],
  providers: [DauKhiBienService],
  controllers: [DauKhiBienController],
})
export class DauKhiBienModule {}

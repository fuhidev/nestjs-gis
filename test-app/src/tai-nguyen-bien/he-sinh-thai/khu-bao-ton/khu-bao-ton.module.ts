import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhuBaoTonController } from './khu-bao-ton.controller';
import { KhuBaoTonEntity } from './khu-bao-ton.entity';
import { KhuBaoTonService } from './khu-bao-ton.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhuBaoTonEntity])],
  providers: [KhuBaoTonService],
  controllers: [KhuBaoTonController],
})
export class KhuBaoTonModule {}

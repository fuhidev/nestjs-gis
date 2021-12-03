import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaiTamController } from './bai-tam.controller';
import { BaiTamEntity } from './bai-tam.entity';
import { BaiTamService } from './bai-tam.service';

@Module({
  imports: [TypeOrmModule.forFeature([BaiTamEntity])],
  providers: [BaiTamService],
  controllers: [BaiTamController],
})
export class BaiTamModule {}

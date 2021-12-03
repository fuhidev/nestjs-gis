import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThuyLoiController } from './thuy-loi.controller';
import { ThuyLoiEntity } from './thuy-loi.entity';
import { ThuyLoiService } from './thuy-loi.service';

@Module({
  imports: [TypeOrmModule.forFeature([ThuyLoiEntity])],
  providers: [ThuyLoiService],
  controllers: [ThuyLoiController],
})
export class ThuyLoiModule {}

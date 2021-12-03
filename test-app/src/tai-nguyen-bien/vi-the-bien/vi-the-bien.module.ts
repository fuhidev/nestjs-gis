import { Module } from '@nestjs/common';
import { CangBienModule } from './cang-bien/cang-bien.module';
import { ThuyLoiModule } from './thuy-loi/thuy-loi.module';

@Module({
  imports: [ViTheBienModule, ThuyLoiModule, CangBienModule],
  providers: [],
  controllers: [],
})
export class ViTheBienModule {}

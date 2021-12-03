import { Module } from '@nestjs/common';
import { DuongBoModule } from './duong-bo/duong-bo.module';
import { HanhLangBaoVeBoBienModule } from './hanh-lang-bao-ve-bo-bien/hanh-lang-bao-ve-bo-bien.module';

@Module({
   imports: [HanhLangBaoVeBoBienModule,
DuongBoModule,

  ],})
export class HanhLangBoBienModule {}

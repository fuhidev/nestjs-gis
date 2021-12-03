import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HanhLangBaoVeBoBienController } from './hanh-lang-bao-ve-bo-bien.controller';
import { HanhLangBaoVeBoBienEntity } from './hanh-lang-bao-ve-bo-bien.entity';
import { HanhLangBaoVeBoBienService } from './hanh-lang-bao-ve-bo-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([HanhLangBaoVeBoBienEntity])],
  providers: [HanhLangBaoVeBoBienService],
  controllers: [HanhLangBaoVeBoBienController]
})
export class HanhLangBaoVeBoBienModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HanhLangBienController } from './hanh-lang-bien.controller';
import { HanhLangBienEntity } from './hanh-lang-bien.entity';
import { HanhLangBienService } from './hanh-lang-bien.service';

@Module({
  imports: [TypeOrmModule.forFeature([HanhLangBienEntity])],
  providers: [HanhLangBienService],
  controllers: [HanhLangBienController],
})
export class HanhLangBienModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NangLuongTaiTaoController } from './nang-luong-tai-tao.controller';
import { NangLuongTaiTaoEntity } from './nang-luong-tai-tao.entity';
import { NangLuongTaiTaoService } from './nang-luong-tai-tao.service';

@Module({
  imports: [TypeOrmModule.forFeature([NangLuongTaiTaoEntity])],
  providers: [NangLuongTaiTaoService],
  controllers: [NangLuongTaiTaoController]
})
export class NangLuongTaiTaoModule { }

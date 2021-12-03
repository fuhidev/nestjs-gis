import { Module } from '@nestjs/common';
import { NangLuongTaiTaoModule } from './nang-luong-tai-tao/nang-luong-tai-tao.module';

@Module({
   imports: [
    NangLuongTaiTaoModule
  ],})
export class KhaiThacNangLuongModule {}

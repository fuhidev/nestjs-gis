import { Module } from '@nestjs/common';
import { KhaiThacTaiNguyenDatChildModule } from './khai-thac-tai-nguyen-dat/khai-thac-tai-nguyen-dat.module';

@Module({
  imports: [KhaiThacTaiNguyenDatChildModule],
  providers: [],
  controllers: [],
})
export class KhaiThacTaiNguyenDatModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhaiThacThuySanChildModule } from './khai-thac-thuy-san/khai-thac-thuy-san.module';
import { NuoiTrongThuySanTrenBienModule } from './nuoi-trong-thuy-san-tren-bien/nuoi-trong-thuy-san-tren-bien.module';

@Module({
  imports: [NuoiTrongThuySanTrenBienModule, KhaiThacThuySanChildModule],
  providers: [],
  controllers: [],
})
export class KhaiThacThuySanModule {}

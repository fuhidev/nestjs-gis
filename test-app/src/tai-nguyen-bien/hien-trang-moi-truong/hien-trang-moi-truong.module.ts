import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhuVucONhiemModule } from './khu-vuc-o-nhiem/khu-vuc-o-nhiem.module';
import { NhanChimBienModule } from './nhan-chim-bien/nhan-chim-bien.module';
import { DiemXaThaiModule } from './diem-xa-thai/diem-xa-thai.module';
import { NhanChimBienVatChatModule } from './nhan-chim-bien/nhan-chim-bien-vat-chat/nhan-chim-bien-vat-chat.module';

@Module({
  imports: [
    NhanChimBienVatChatModule,
    DiemXaThaiModule,
    NhanChimBienModule,
    KhuVucONhiemModule,
  ],
  providers: [],
  controllers: [],
})
export class HienTrangMoiTruongModule {}

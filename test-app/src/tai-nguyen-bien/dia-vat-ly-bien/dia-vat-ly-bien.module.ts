import { Module } from '@nestjs/common';
import { LyHoaBienModule } from './ly-hoa-bien/ly-hoa-bien.module';
import { DiaVatBienModule } from './dia-vat-bien/dia-vat-bien.module';
import { KhoangSanModule } from './khoang-san/khoang-san.module';
import { DiaChatModule } from './dia-chat/dia-chat.module';
import { PhanBoTramTichModule } from './phan-bo-tram-tich/phan-bo-tram-tich.module';
import { DauKhiBienModule } from './dau-khi-bien/dau-khi-bien.module';
import { DuongTrieuModule } from './duong-trieu/duong-trieu.module';

@Module({
  imports: [
    DuongTrieuModule,
    DauKhiBienModule,

    PhanBoTramTichModule,
    DiaChatModule,
    KhoangSanModule,
    DiaVatBienModule,
    LyHoaBienModule,
  ],
  providers: [],
  controllers: [],
})
export class DiaVatLyBienModule {}

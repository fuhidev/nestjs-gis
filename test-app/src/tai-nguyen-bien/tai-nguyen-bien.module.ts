import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaVatLyBienModule } from './dia-vat-ly-bien/dia-vat-ly-bien.module';
import { ViTheBienModule } from './vi-the-bien/vi-the-bien.module';
import { HeSinhThaiModule } from './he-sinh-thai/he-sinh-thai.module';
import { HienTrangMoiTruongModule } from './hien-trang-moi-truong/hien-trang-moi-truong.module';
import { QuyHoachBaoVeModule } from './quy-hoach-bao-ve/quy-hoach-bao-ve.module';
import { KhaiThacDuLichModule } from './khai-thac-du-lich/khai-thac-du-lich.module';
import { KhaiThacTaiNguyenDatModule } from './khai-thac-tai-nguyen-dat/khai-thac-tai-nguyen-dat.module';
import { KhaiThacThuySanModule } from './khai-thac-thuy-san/khai-thac-thuy-san.module';
import { GiaoThongModule } from './giao-thong/giao-thong.module';
import { QuyHoachPhatTrienModule } from './quy-hoach-phat-trien/quy-hoach-phat-trien.module';
import { DanhMucModule } from './danh-muc/danh-muc.module';
import { DamPhaVenBienModule } from './dam-pha-ven-bien/dam-pha-ven-bien.module';
import { KhaiThacNangLuongModule } from './khai-thac-nang-luong/khai-thac-nang-luong.module';
import { HanhLangBoBienModule } from './hanh-lang-bo-bien/hanh-lang-bo-bien.module';

@Module({
  imports: [
    DanhMucModule,
    QuyHoachPhatTrienModule,

    GiaoThongModule,

    KhaiThacThuySanModule,
    KhaiThacTaiNguyenDatModule,
    KhaiThacDuLichModule,

    QuyHoachBaoVeModule,

    HienTrangMoiTruongModule,
    HeSinhThaiModule,
    ViTheBienModule,
    DiaVatLyBienModule,
    DamPhaVenBienModule,
    KhaiThacNangLuongModule,
    HanhLangBoBienModule,
  ],
  providers: [],
  controllers: [],
})
export class TaiNguyenBienModule {}

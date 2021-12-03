import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiTichModule } from './di-tich/di-tich.module';
import { BaiTamModule } from './bai-tam/bai-tam.module';
import { HienTrangPhatTrienDuLichModule } from './hien-trang-phat-trien-du-lich/hien-trang-phat-trien-du-lich.module';
import { QuyHoachPhatTrienDuLichModule } from './quy-hoach-phat-trien-du-lich/quy-hoach-phat-trien-du-lich.module';
import { KhaiThacDuLichModule as CKhaiThacDuLichModule } from './khai-thac-du-lich/khai-thac-du-lich.module';
@Module({
  imports: [
    QuyHoachPhatTrienDuLichModule,
    HienTrangPhatTrienDuLichModule,
    BaiTamModule,
    DiTichModule,
    CKhaiThacDuLichModule,
  ],
  providers: [],
  controllers: [],
})
export class KhaiThacDuLichModule {}

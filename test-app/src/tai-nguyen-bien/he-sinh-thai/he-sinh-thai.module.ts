import { Module } from '@nestjs/common';
import { KhuBaoTonModule } from './khu-bao-ton/khu-bao-ton.module';
import { DaDangSinhHocThuySanModule } from './da-dang-sinh-hoc-thuy-san/da-dang-sinh-hoc-thuy-san.module';
import { DiemRanSanHoModule } from './diem-ran-san-ho/diem-ran-san-ho.module';
import { SinhThaiBienDamPhaModule } from './sinh-thai-bien-dam-pha/sinh-thai-bien-dam-pha.module';

@Module({
  imports: [
    SinhThaiBienDamPhaModule,
    DiemRanSanHoModule,
    DaDangSinhHocThuySanModule,
    KhuBaoTonModule,
  ],
  providers: [],
  controllers: [],
})
export class HeSinhThaiModule {}

import { Module } from '@nestjs/common';
import { QuyHoachVungBaoVeModule } from './quy-hoach-vung-bao-ve/quy-hoach-vung-bao-ve.module';
import { QuyHoachAnNinhQuocPhongModule } from './quy-hoach-an-ninh-quoc-phong/quy-hoach-an-ninh-quoc-phong.module';

@Module({
  imports: [QuyHoachAnNinhQuocPhongModule, QuyHoachVungBaoVeModule],
  providers: [],
  controllers: [],
})
export class QuyHoachBaoVeModule {}

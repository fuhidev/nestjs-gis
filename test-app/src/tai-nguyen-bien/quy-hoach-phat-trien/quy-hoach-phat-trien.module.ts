import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuyHoachVungDichVuModule } from './quy-hoach-vung-dich-vu/quy-hoach-vung-dich-vu.module';

@Module({
  imports: [QuyHoachVungDichVuModule],
  providers: [],
  controllers: [],
})
export class QuyHoachPhatTrienModule {}

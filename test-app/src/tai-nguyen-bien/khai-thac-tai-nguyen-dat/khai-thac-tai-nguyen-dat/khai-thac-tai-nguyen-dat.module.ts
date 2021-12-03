import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhaiThacTaiNguyenDatController } from './khai-thac-tai-nguyen-dat.controller';
import { KhaiThacTaiNguyenDatEntity } from './khai-thac-tai-nguyen-dat.entity';
import { KhaiThacTaiNguyenDatService } from './khai-thac-tai-nguyen-dat.service';

@Module({
  imports: [TypeOrmModule.forFeature([KhaiThacTaiNguyenDatEntity])],
  providers: [KhaiThacTaiNguyenDatService],
  controllers: [KhaiThacTaiNguyenDatController],
})
export class KhaiThacTaiNguyenDatChildModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmKhaiThacThuySanModule } from './danh-muc/dm-khai-thac-thuy-san/dm-khai-thac-thuy-san.module';
import { KhaiThacThuySanController } from './khai-thac-thuy-san.controller';
import { HienTrangKhaiThacThuySanEntity } from './khai-thac-thuy-san.entity';
import { KhaiThacThuySanService } from './khai-thac-thuy-san.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HienTrangKhaiThacThuySanEntity]),
    DmKhaiThacThuySanModule,
  ],
  providers: [KhaiThacThuySanService],
  controllers: [KhaiThacThuySanController],
})
export class KhaiThacThuySanChildModule {}

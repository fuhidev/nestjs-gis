import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMKhaiThacThuySanController } from './dm-khai-thac-thuy-san.controller';
import { DMKhaiThacThuySanEntity } from './dm-khai-thac-thuy-san.entity';
import { DMKhaiThacThuySanService } from './dm-khai-thac-thuy-san.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMKhaiThacThuySanEntity])],
  providers: [DMKhaiThacThuySanService],
  controllers: [DMKhaiThacThuySanController],
})
export class DmKhaiThacThuySanModule {}

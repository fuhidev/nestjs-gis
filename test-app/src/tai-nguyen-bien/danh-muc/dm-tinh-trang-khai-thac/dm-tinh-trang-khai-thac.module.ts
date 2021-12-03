import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMTinhTrangKhaiThacController } from './dm-tinh-trang-khai-thac.controller';
import { DMTinhTrangKhaiThacEntity } from './dm-tinh-trang-khai-thac.entity';
import { DMTinhTrangKhaiThacService } from './dm-tinh-trang-khai-thac.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMTinhTrangKhaiThacEntity])],
  providers: [DMTinhTrangKhaiThacService],
  controllers: [DMTinhTrangKhaiThacController],
})
export class DmTinhTrangKhaiThacModule {}

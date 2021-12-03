import { Module } from '@nestjs/common';
import { DMLoaiThachQuyenModule } from './dm-loai-thach-quyen/dm-loai-thach-quyen.module';
import { DMLoaiThuyQuyenModule } from './dm-loai-thuy-quyen/dm-loai-thuy-quyen.module';
import { DMGiaiDoanModule } from './dm-phan-loai/dm-phan-loai.module';
import { DmTinhTrangKhaiThacModule } from './dm-tinh-trang-khai-thac/dm-tinh-trang-khai-thac.module';

@Module({
  imports: [
    DMLoaiThachQuyenModule,
    DMLoaiThuyQuyenModule,
    DMGiaiDoanModule,
    DmTinhTrangKhaiThacModule,
  ],
})
export class DanhMucModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BienModule } from './bien/bien.module';
import { TimDuongModule } from './tim-duong/tim-duong.module';
import { TimSongModule } from './tim-song/tim-song.module';
import { HanhLangBienModule } from './hanh-lang-bien/hanh-lang-bien.module';
import { DuongDangSauModule } from './duong-dang-sau/duong-dang-sau.module';
import { DuongDinhBoModule } from './duong-dinh-bo/duong-dinh-bo.module';

@Module({
  imports: [
    DuongDinhBoModule,
    DuongDangSauModule,
    HanhLangBienModule,
    TimSongModule,
    TimDuongModule,
    TimSongModule,
    BienModule,
    TimDuongModule,
    GiaoThongModule,
  ],
  providers: [],
  controllers: [],
})
export class GiaoThongModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DamPhaVenBienController } from './dam-pha-ven-bien.controller';
import { DamPhaVenBienEntity } from './dam-pha-ven-bien.entity';
import { DamPhaVenBienService } from './dam-pha-ven-bien.service';
import { DmLoaiDamPhaModule } from './danh-muc/dm-loai-dam-pha/dm-loai-dam-pha.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DamPhaVenBienEntity]),
    DmLoaiDamPhaModule,
  ],
  providers: [DamPhaVenBienService],
  controllers: [DamPhaVenBienController],
})
export class DamPhaVenBienModule {}

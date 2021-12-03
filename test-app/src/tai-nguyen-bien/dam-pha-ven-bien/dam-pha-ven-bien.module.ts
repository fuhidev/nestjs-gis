import { Module } from '@nestjs/common';
import { DamPhaVenBienModule as DPVBModule } from './dam-pha-ven-bien/dam-pha-ven-bien.module';

@Module({
  imports: [DPVBModule],
})
export class DamPhaVenBienModule {}

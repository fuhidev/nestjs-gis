import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhThaiBienDamPhaController } from './sinh-thai-bien-dam-pha.controller';
import { SinhThaiBienDamPhaEntity } from './sinh-thai-bien-dam-pha.entity';
import { SinhThaiBienDamPhaService } from './sinh-thai-bien-dam-pha.service';

@Module({
  imports: [TypeOrmModule.forFeature([SinhThaiBienDamPhaEntity])],
  providers: [SinhThaiBienDamPhaService],
  controllers: [SinhThaiBienDamPhaController],
})
export class SinhThaiBienDamPhaModule {}

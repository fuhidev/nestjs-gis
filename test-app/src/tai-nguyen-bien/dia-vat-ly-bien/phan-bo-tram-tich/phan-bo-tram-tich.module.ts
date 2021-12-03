import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhanBoTramTichController } from './phan-bo-tram-tich.controller';
import { PhanBoTramTichEntity } from './phan-bo-tram-tich.entity';
import { PhanBoTramTichService } from './phan-bo-tram-tich.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhanBoTramTichEntity])],
  providers: [PhanBoTramTichService],
  controllers: [PhanBoTramTichController],
})
export class PhanBoTramTichModule {}

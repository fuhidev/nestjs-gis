import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CayXanhController } from './cay-xanh.controller';
import { CayXanhEntity } from './cay-xanh.entity';
import { CayXanhService } from './cay-xanh.service';

@Module({
  imports: [TypeOrmModule.forFeature([CayXanhEntity])],
  providers: [CayXanhService],
  controllers: [CayXanhController]
})
export class CayXanhModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NhanChimBienVatChatModule } from './nhan-chim-bien-vat-chat/nhan-chim-bien-vat-chat.module';
import { NhanChimBienController } from './nhan-chim-bien.controller';
import { NhanChimBienEntity } from './nhan-chim-bien.entity';
import { NhanChimBienService } from './nhan-chim-bien.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NhanChimBienEntity]),
    NhanChimBienVatChatModule,
  ],
  providers: [NhanChimBienService],
  controllers: [NhanChimBienController],
})
export class NhanChimBienModule {}

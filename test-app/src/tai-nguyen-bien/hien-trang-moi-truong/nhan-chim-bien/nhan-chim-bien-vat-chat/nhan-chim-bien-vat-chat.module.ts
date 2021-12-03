import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmVatChatNhanChimModule } from './danh-muc/dm-vat-chat-nhan-chim/dm-vat-chat-nhan-chim.module';
import { NhanChimBienVatChatController } from './nhan-chim-bien-vat-chat.controller';
import { NhanChimBienVatChatEntity } from './nhan-chim-bien-vat-chat.entity';
import { NhanChimBienVatChatService } from './nhan-chim-bien-vat-chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NhanChimBienVatChatEntity]),
    DmVatChatNhanChimModule,
  ],
  providers: [NhanChimBienVatChatService],
  controllers: [NhanChimBienVatChatController],
})
export class NhanChimBienVatChatModule {}

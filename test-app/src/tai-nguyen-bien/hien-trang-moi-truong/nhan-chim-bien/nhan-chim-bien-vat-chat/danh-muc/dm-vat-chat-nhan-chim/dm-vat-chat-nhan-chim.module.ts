import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMVatChatNhanChimController } from './dm-vat-chat-nhan-chim.controller';
import { DMVatChatNhanChimEntity } from './dm-vat-chat-nhan-chim.entity';
import { DMVatChatNhanChimService } from './dm-vat-chat-nhan-chim.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMVatChatNhanChimEntity])],
  providers: [DMVatChatNhanChimService],
  controllers: [DMVatChatNhanChimController],
})
export class DmVatChatNhanChimModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaChatController } from './dia-chat.controller';
import { DiaChatEntity } from './dia-chat.entity';
import { DiaChatService } from './dia-chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaChatEntity])],
  providers: [DiaChatService],
  controllers: [DiaChatController],
})
export class DiaChatModule {}

import { Module } from '@nestjs/common';
import { CodedDomainController } from './coded-domain.controller';
import { CodedDomainService } from './coded-domain.service';

@Module({
  controllers: [CodedDomainController],
  providers: [CodedDomainService],
})
export class CodedDomainModule { }

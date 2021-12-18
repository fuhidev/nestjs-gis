import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainController } from './domain.controller';
import { DomainEntity } from './domain.entity';
import { DomainService } from './domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([DomainEntity])],
  providers: [DomainService],
  controllers: [DomainController]
})
export class DomainModule { }

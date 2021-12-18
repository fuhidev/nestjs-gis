import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainGroupController } from './domain-group.controller';
import { DomainGroupEntity } from './domain-group.entity';
import { DomainGroupService } from './domain-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([DomainGroupEntity])],
  providers: [DomainGroupService],
  controllers: [DomainGroupController]
})
export class DomainGroupModule { }

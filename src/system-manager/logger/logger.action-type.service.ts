import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerActionTypeEntity } from './logger-action-type.entity';

@Injectable()
export class LoggerActionTypeService extends TypeOrmCrudService<LoggerActionTypeEntity> {
    constructor(
        @InjectRepository(LoggerActionTypeEntity) repo
    ) {
        super(repo);
    }
}

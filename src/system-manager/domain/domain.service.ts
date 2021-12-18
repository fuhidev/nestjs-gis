import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEntity } from './domain.entity';

@Injectable()
export class DomainService extends TypeOrmCrudService<DomainEntity>{

    constructor(@InjectRepository(DomainEntity) repo) {
        super(repo);
    }

}

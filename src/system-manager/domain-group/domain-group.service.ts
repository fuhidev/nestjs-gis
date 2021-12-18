import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainGroupEntity } from './domain-group.entity';

@Injectable()
export class DomainGroupService extends TypeOrmCrudService<DomainGroupEntity>{

    constructor(@InjectRepository(DomainGroupEntity) repo) {
        super(repo);
    }

}

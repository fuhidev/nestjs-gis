import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationGroupEntity } from './application-group.entity';

@Injectable()
export class ApplicationGroupService extends TypeOrmCrudService<ApplicationGroupEntity>{
    constructor(
        @InjectRepository(ApplicationGroupEntity) repo
    ){
        super(repo);
    }
}

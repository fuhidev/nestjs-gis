import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ApplicationEntity } from './application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';

@Injectable()
export class ApplicationService extends TypeOrmCrudService<ApplicationEntity>{
    constructor(
        @InjectRepository(ApplicationEntity) repo
    ) {
        super(repo);
    }
}

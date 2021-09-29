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

    async getMany(req: CrudRequest) {
        const result = await super.getMany(req);
        if (this.decidePagination(req.parsed, req.options)) {
            (result as GetManyDefaultResponse<ApplicationEntity>).data.forEach(f => {
                if (f.config) {
                    f.config = JSON.parse(f.config);
                }
            })
        } else {
            (result as ApplicationEntity[]).forEach(f => {
                if (f.config) {
                    f.config = JSON.parse(f.config);
                }
            });
        }


        return result;
    }

    async getOne(req: CrudRequest) {
        const result = await super.getOne(req) as ApplicationEntity;
        if (result.config) {
            result.config = JSON.parse(result.config);
        }
        return result;
    }
}

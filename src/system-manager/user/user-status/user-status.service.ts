import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { UserStatusEntity } from "./user-status.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserStatusService extends TypeOrmCrudService<UserStatusEntity>{
    constructor(
        @InjectRepository(UserStatusEntity) repo
    ){
        super(repo);
    }
}
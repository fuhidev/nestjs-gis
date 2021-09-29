import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ColumnEntity } from './column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LayerService } from '../layer/layer.service';

@Injectable()
export class ColumnService{
    constructor(
    ) {
    }
}

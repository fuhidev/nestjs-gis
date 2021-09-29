import { Controller, Post, Query } from '@nestjs/common';
import { ColumnService } from './column.service';

@Controller('sys/column')
export class ColumnController {
    constructor(private service: ColumnService) { }
}

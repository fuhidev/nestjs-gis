import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LoggerEntity } from './logger.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { Column, Workbook } from 'exceljs';
@Injectable()
export class LoggerService extends TypeOrmCrudService<LoggerEntity> {
    constructor(
        @InjectRepository(LoggerEntity) public repo: Repository<LoggerEntity>,
    ) {
        super(repo);
    }

    async exportXlsx(req: CrudRequest) {
        req.parsed.join = [
            { field: 'user', select: ['displayName'] },
            { field: 'actionType', select: ['name'] }
        ];

        const result = await this.getMany(req) as LoggerEntity[];


        const workbook = new Workbook();
        const sheet = workbook.addWorksheet('sheet');
        
        sheet.columns = [
            {header:'Tên người dùng',key:'displayName',width:50},
            {header:'Tác vụ',key:'action',width:25},
            {header:'Thời gian',key:'date',width:75},
            {header:'Mô tả',key:'description',width:250},
            {header:'Ghi chú',key:'note',width:1000},
                    ] as Array<Column>;
            sheet.addRows(result.map(m=>({
                displayName:m.user && m.user.displayName || '',
                action:m.actionType && m.actionType.name || '',
                date:m.createDate.toJSON() || '',
                description:m.description || '',
                note:m.note || ''
            })))

        return workbook;
    }
}

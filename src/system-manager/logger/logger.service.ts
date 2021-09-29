import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LoggerEntity } from './logger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudRequest } from '@nestjsx/crud';
@Injectable()
export class LoggerService extends TypeOrmCrudService<LoggerEntity> {
    constructor(
        @InjectRepository(LoggerEntity) public repo: Repository<LoggerEntity>,
    ) {
        super(repo);
    }

    // async exportXlsx(req: CrudRequest) {
    //     req.parsed.join = [
    //         { field: 'user', select: ['displayName'] },
    //         { field: 'actionType', select: ['name'] }
    //     ];

    //     const result = await this.getMany(req) as LoggerEntity[];


    //     const workbook = new Workbook();
    //     const sheet = workbook.addWorksheet('sheet');
        
    //     sheet.column(1).setWidth(50);
    //     sheet.column(2).setWidth(25);
    //     sheet.column(3).setWidth(75);
    //     sheet.column(4).setWidth(250);
    //     sheet.column(5).setWidth(1000);

    //     sheet.cell(1, 1).string('Tên người dùng');
    //     sheet.cell(1, 2).string('Tác vụ');
    //     sheet.cell(1, 3).string('Thời gian');
    //     sheet.cell(1, 4).string('Mô tả');
    //     sheet.cell(1, 5).string('Ghi chú');

    //     for (let index = 0; index < result.length; index++) {
    //         const item = result[index];
    //         sheet.cell(2 + index, 1).string(item.user?.displayName);
    //         sheet.cell(2 + index, 2).string(item?.actionType?.name);
    //         sheet.cell(2 + index, 3).string(item.createDate.toJSON());
    //         sheet.cell(2 + index, 4).string( item.description);
    //         sheet.cell(2 + index, 5).string(item.note);
    //     }

    //     return workbook;
    // }
}

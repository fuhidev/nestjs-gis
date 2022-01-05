import { LoggerActionTypeEnum } from '../system-manager/logger/logger.interface';
import { RequestContext } from '../request-context';
import { UserEntity } from '../system-manager/user/user.entity';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getRepository, Repository } from 'typeorm';
import { LoggerEntity } from '../system-manager/logger/logger.entity';

export async function dataLoggerHook(name) {
  if (['createOne', 'createMany', 'updateOne', 'deleteOne'].includes(name)) {
    const user = RequestContext.currentContext.req.user as UserEntity;
    if (user) {
      let note: string, description: string, actionTypeId: LoggerActionTypeEnum;
      if (['createOne', 'createMany'].includes(name)) {
        const [result] = arguments[1] as [Partial<any>];
        note = JSON.stringify(result);
        description =
          name === 'createOne' ? 'Thêm mới dữ liệu' : 'Thêm đồng loạt dữ liệu';
        actionTypeId = LoggerActionTypeEnum.INSERT;
      } else if (name === 'updateOne') {
        const [result, crud, dto] = arguments[1] as [
          Partial<any>,
          CrudRequest,
          Partial<any>
        ];
        note = JSON.stringify(dto);
        description = 'Cập nhật dữ liệu';
        actionTypeId = LoggerActionTypeEnum.UPDATE;
      } else if (name === 'deleteOne') {
        const [crud] = arguments[1] as [CrudRequest];
        const service = this as TypeOrmCrudService<any>;
        const primaryParam = service.getPrimaryParam(crud.options);
        if (primaryParam) {
          const paramFilter = service.getParamFilters(crud.parsed);
          if (paramFilter[primaryParam]) {
            note = `Mã: ${paramFilter[primaryParam]}`;
          }
        }
        description = 'Xoá dữ liệu';
        actionTypeId = LoggerActionTypeEnum.REMOVE;
      }
      const logRepo = getRepository(LoggerEntity);
      const repo = this.repo as Repository<any>;
      const logEntity = logRepo.create({
        actionTypeId,
        description,
        note,
        tableName: repo.metadata.tableName,
        userId: user.userId,
      });
      await logRepo.save(logEntity);
    }
  }
}

import { SelectQueryBuilder } from 'typeorm';
import { BaseInterceptor } from './base.interceptor';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { CrudRequestOptions } from '@nestjsx/crud';
import { NotImplementedException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

export class CreateBuilderInterceptor extends BaseInterceptor {
  intercept(
    target: TypeOrmCrudService<any>,
    builder: SelectQueryBuilder<any>,
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many: boolean,
  ): Promise<SelectQueryBuilder<any>> {
    throw new NotImplementedException();
  }
}

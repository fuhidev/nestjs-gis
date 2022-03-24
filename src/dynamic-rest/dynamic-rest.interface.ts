import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ColumnOptions } from '../typeorm/decorators/column';
import { JoinColumnOptions, RelationOptions } from 'typeorm';
import { CrudOptions } from '@nestjsx/crud';

export interface RestEntityColumn extends ColumnOptions {
  propertyName: string;
  join?: {
    type: 'one-to-one' | 'many-to-one' | 'one-to-many';
    joinColumn: JoinColumnOptions;
    relation?: RelationOptions;
    target: string;
  };
}

export interface RestEntity {
  path: string;
  tableName: string;
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  crudOptions?: Partial<CrudOptions>;
  columns: Array<RestEntityColumn>;
}

export interface DynamicRestOptions {
  restEntities: Array<RestEntity>;
  dbConfig: TypeOrmModuleOptions;
}

export interface DynamicRestFromSysOptions {
  sysDbName?: string;
  dbConfig: TypeOrmModuleOptions;
}

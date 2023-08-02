import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CrudOptions } from '@nestjsx/crud';
import { JoinColumnOptions, RelationOptions } from 'typeorm';
import { ColumnOptions } from '../typeorm/decorators/column';

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

export interface ITableColumn {
  name: string;
  table: string;
  isPrimary: 0 | 1;
  type: string;
}

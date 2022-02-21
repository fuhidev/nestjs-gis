import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ColumnOptions } from '../typeorm/decorators/column';
import { JoinColumnOptions, RelationOptions } from 'typeorm';
import { CrudOptions } from '@nestjsx/crud';

export interface RestEntity {
  path: string;
  tableName: string;
  decorators?: Array<PropertyDecorator | MethodDecorator>;  
  crudOptions?:Partial<CrudOptions>;
  columns: Array<
    ColumnOptions & {
      propertyName: string;
      join?: {
        type: 'one-to-one' | 'many-to-one' | 'one-to-many';
        joinColumn: JoinColumnOptions;
        relation?: RelationOptions;
        target: string;
      };
    }
  >;
}

export interface DynamicRestOptions {
  restEntities: Array<RestEntity>;
  dbConfig: TypeOrmModuleOptions;
}

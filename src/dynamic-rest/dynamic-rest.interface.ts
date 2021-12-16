import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ColumnOptions } from 'typeorm';

export const  dynamicRestConName = 'DynamicRestCon';

export interface RestEntity{
    path: string;
    tableName: string;
    columns: Array<ColumnOptions & { propertyName: string }>;
  }
  
  export interface DynamicRestOptions{
    restEntities:Array<RestEntity>,
    dbConfig:TypeOrmModuleOptions
  }

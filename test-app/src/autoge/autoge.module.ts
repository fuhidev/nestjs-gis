import { Controller, DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GISTypeOrmCrudService } from 'nestjs-gis';
import {
  Column,
  ColumnOptions,
  Entity,
  getMetadataArgsStorage,
  getRepository,
  PrimaryColumn,
} from 'typeorm';
const controllers = [
  {
    path: 'rest/ong-phan-phoi',
    tableName: 'ONGPHANPHOI',
    columns: [
      { name: 'objectId', tableName: 'OBJECTID', type: 'int', isPrimary: true },
    ],
  },
];
@Module({})
export class AutogeModule {
  static async forRoot(): Promise<DynamicModule> {
    const entities = [];
    controllers.forEach(controller => {
      function entity() {
        for (const col of controller.columns) {
          this[col.name] = void 0;
        }
      }

      for (const col of controller.columns) {
        Column({
          name: col.tableName,
          type: col.type,
          primary: col.isPrimary,
        } as ColumnOptions)(entity, col.name);
      }
      // setTimeout(() => {
      Entity(controller.tableName)(entity);
      entities.push(entity);
      // }, 0);

      //       setTimeout(() => {
      //         const repo = getRepository(entity);
      //         console.log(repo);
      //       }, 5000);

      // const service = new GISTypeOrmCrudService(repo);
      // function ctr() {
      //   this.service = service;
      // }
      // Controller(controller.path)(ctr);
    });
    return {
      module: AutogeModule,
      imports: [
        TypeOrmModule.forRoot({
          options: { encrypt: false },
          keepConnectionAlive: true,
          type: 'mssql',
          host: '171.244.32.245',
          port: 1433,
          username: 'sa',
          password: 'Ditagis123',
          database: 'NinhThuan_TaiNguyenBien',
          synchronize: false,
          name: 'wtff',
          logging: false,
          entities,
        }),
      ],
    };
  }
}

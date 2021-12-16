import { Controller, DynamicModule, Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from '@nestjsx/crud';
import {
  geometryTransformer,
  GeometryTypeEnum,
  GISCrud,
  GISTypeOrmCrudService,
  RouteMetadata,
} from 'nestjs-gis';
import {
  Column,
  ColumnOptions,
  Entity,
  getMetadataArgsStorage,
  getRepository,
  PrimaryColumn,
} from 'typeorm';

var __decorate = function(decorators, target, key?, desc?) {
  var c = arguments.length,
    r =
      c < 3
        ? target
        : desc === null
        ? (desc = Object.getOwnPropertyDescriptor(target, key))
        : desc,
    d;
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i]))
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = function(k, v) {
  if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
    return Reflect.metadata(k, v);
};
var __param = function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
const dbName = 'HIEUDEPTRAI';
const controllers: Array<{
  path: string;
  tableName: string;
  columns: Array<ColumnOptions & { propertyName: string }>;
}> = [
  {
    path: 'rest/di-tich',
    tableName: 'DITICH',
    columns: [
      {
        propertyName: 'objectId',
        name: 'OBJECTID',
        type: 'int',
        primary: true,
      },
      {
        propertyName: 'shape',
        name: 'SHAPE',
        transformer: geometryTransformer,
        type: 'geometry',
        spatialFeatureType: GeometryTypeEnum.Point,
      },
    ],
  },
  {
    path: 'rest/dam-pha-ven-bien',
    tableName: 'DAMPHAVENBIEN',
    columns: [
      {
        propertyName: 'objectId',
        name: 'OBJECTID',
        type: 'int',
        primary: true,
      },
      {
        propertyName: 'shape',
        name: 'SHAPE',
        transformer: geometryTransformer,
        type: 'geometry',
        spatialFeatureType: GeometryTypeEnum.Polygon,
      },
    ],
  },
];

@Module({})
export class AutogeModule {
  static async forRoot(): Promise<DynamicModule> {
    const entities = [];
    const modules = [];
    for (const controller of controllers) {
      var EntityCls = new Function(
        'return function ' + controller.tableName + '(){ }',
      )();

      for (const column of controller.columns) {
        __decorate(
          [Column({ ...column }), __metadata('design:type', void 0)],
          EntityCls.prototype,
          column.propertyName,
          void 0,
        );
      }

      //@ts-ignore
      EntityCls = __decorate(
        [Entity(controller.tableName, { synchronize: false })],
        EntityCls,
      );
      entities.push(EntityCls);

      let Service = class extends GISTypeOrmCrudService<any> {
        constructor(repo) {
          super(repo);
        }
      };
      Service = __decorate(
        [
          Injectable(),
          __param(0, InjectRepository(EntityCls, dbName)),
          __metadata('design:paramtypes', [Object]),
        ],
        Service,
      );

      let ControllerCls = class {
        service;
        constructor(service) {
          this.service = service;
        }
        ngOnInit() {}
      };
      ControllerCls = __decorate(
        [
          RouteMetadata(),
          GISCrud(),
          Crud({
            model: { type: EntityCls },
            params: {
              objectId: {
                primary: true,
                field: 'objectId',
                type: 'number',
              },
            },
            query: {
              join: {
                loaiKhu: {},
              },
            },
          }),
          Controller(controller.path),
          __metadata('design:paramtypes', [Service]),
        ],
        ControllerCls,
      );

      let DamPhaVenBienModule = class DamPhaVenBienModule {};
      DamPhaVenBienModule = __decorate(
        [
          Module({
            imports: [TypeOrmModule.forFeature([EntityCls], dbName)],
            providers: [Service],
            controllers: [ControllerCls],
          }),
        ],
        DamPhaVenBienModule,
      );
      modules.push(DamPhaVenBienModule);
    }
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
          name: dbName,
          logging: false,
          entities,
        }),
        ...modules,
      ],
    };
  }
}

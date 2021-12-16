import { Controller, Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from '@nestjsx/crud/lib/decorators/crud.decorator';
import { GISTypeOrmCrudService } from '../crud-typeorm/typeorm-crud.service';
import { GISCrud } from '../crud/crud.decorator';
import { RouteMetadata } from '../decorators/route-metadata.decorator';
import { Column, Entity } from 'typeorm';
import { dynamicRestConName, DynamicRestOptions } from './dynamic-rest.interface';
import { __decorate, __metadata, __param } from './dynamic-rest.util';
import { geometryTransformer } from '../transformer/geometry.transformer';

export function generateDynamicRest(
    options:DynamicRestOptions
){
const {restEntities} = options;
const entities = [];
const modules = [];
for (const item of restEntities) {
  var EntityCls = new Function(
    'return function ' + item.tableName + '(){ }',
  )();

  for (const column of item.columns) {
    if(column.type === 'geometry'){
      column.transformer= geometryTransformer;
    }
    __decorate(
      [Column({ ...column }), __metadata('design:type', void 0)],
      EntityCls.prototype,
      column.propertyName,
      void 0,
    );
  }

  //@ts-ignore
  EntityCls = __decorate(
    [Entity(item.tableName, { synchronize: false })],
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
      __param(0, InjectRepository(EntityCls, dynamicRestConName)),
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
      Controller(item.path),
      __metadata('design:paramtypes', [Service]),
    ],
    ControllerCls,
  );

  let ModuleCls = class DamPhaVenBienModule {};
  ModuleCls = __decorate(
    [
      Module({
        imports: [TypeOrmModule.forFeature([EntityCls], dynamicRestConName)],
        providers: [Service],
        controllers: [ControllerCls],
      }),
    ],
    ModuleCls,
  );
  modules.push(ModuleCls);
  
}
return {
    modules,entities
}
}
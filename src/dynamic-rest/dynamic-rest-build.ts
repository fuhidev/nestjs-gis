import { Controller, Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from '@nestjsx/crud/lib/decorators/crud.decorator';
import { GISTypeOrmCrudService } from '../crud-typeorm/typeorm-crud.service';
import { GISCrud } from '../crud/crud.decorator';
import { RouteMetadata } from '../decorators/route-metadata.decorator';
import { ColumnType, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  dynamicRestConName,
  DynamicRestOptions,
} from './dynamic-rest.interface';
import { __decorate, __metadata, __param } from './dynamic-rest.util';
import { geometryTransformer } from '../transformer/geometry.transformer';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Column } from '../typeorm/decorators/column';

export function generateDynamicRest(options: DynamicRestOptions) {
  const { restEntities } = options;
  const entities = [];
  const modules = [];
  for (const item of restEntities) {
    var EntityCls = new Function(
      'return function ' + item.tableName + '(){ }',
    )();

    for (const column of item.columns) {
      if (column.type === 'geometry') {
        column.transformer = geometryTransformer;
      }
      if (column.join) {
        if (
          column.join.type === 'one-to-many' ||
          column.join.type === 'many-to-one'
        ) {
          __decorate(
            [
              JoinColumn({ ...column.join.joinColumn }),
              column.join.type === 'many-to-one'
                ? ManyToOne(column.join.target, column.join.relation)
                : OneToMany(column.join.target, '', column.join.relation),
              __metadata('design:type', void 0),
            ],
            EntityCls.prototype,
            column.propertyName,
            void 0,
          );
        }
      } else {
        __decorate(
          [Column({ ...column }), __metadata('design:type', void 0)],
          EntityCls.prototype,
          column.propertyName,
          void 0,
        );
      }
    }

    //@ts-ignore
    EntityCls = __decorate(
      [Entity(item.tableName, { synchronize: false })],
      EntityCls,
    );
    entities.push(EntityCls);

    const isGisTable = item.columns.some(s => s.type === 'geometry');

    let Service = isGisTable
      ? class extends GISTypeOrmCrudService<any> {
          constructor(repo) {
            super(repo);
          }
        }
      : class extends TypeOrmCrudService<any> {
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
    const primaryCol = item.columns.find(f => f.primary);
    const queryJoin = {};
    item.columns
      .filter(f => f.join)
      .forEach(col => {
        queryJoin[col.propertyName] = {};
      });
    ControllerCls = __decorate(
      [
        RouteMetadata(),
        ...(isGisTable ? [GISCrud()] : []),
        Crud({
          model: { type: EntityCls },
          params: {
            id: {
              primary: true,
              field: primaryCol.name,
              type: sqlType2Js(primaryCol.type) as any,
            },
          },
          query: {
            join: queryJoin,
          },
        }),
        Controller(item.path),
        __metadata('design:paramtypes', [Service]),
      ],
      ControllerCls,
    );

    let ModuleCls = class ModuleCls {};
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
    modules,
    entities,
  };
}

function sqlType2Js(type: ColumnType) {
  if (
    (['int', 'bigint', 'float', 'decimal'] as Array<ColumnType>).includes(type)
  ) {
    return 'number';
  } else if (type === 'bit') {
    return 'boolean';
  }
  return 'string';
}

import { Get } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { CRUD_OPTIONS_METADATA } from '@nestjsx/crud/lib/constants';
import { getMetadataArgsStorage, getRepository, Repository } from 'typeorm';
import { LayerEntity } from '../system-manager';
import { moduleOptions } from '../token';
import { ColumnOptions } from '../typeorm/decorators/column';
export const CONTROLLER_PATH_ENTITY = 'CONTROLLER_PATH_ENTITY';
export interface Relation {
  displayColumn: string;
  primaryColumn: string;
  type: 'one-to-one' | 'many-to-one' | 'one-to-many';
  name: string;
  url: string;
}

export interface ColumnMeta {
  name: string;
  alias: string;
  type: string;
  isNullable: boolean;
  isPrimary: boolean;
  isCreateDate: boolean;
  isGenerated: boolean;
  readonly: boolean;
  relation?: Relation;
  isDisplayColumn: boolean;
}
export interface RendererMeta {
  type: string;
  symbol: Symbol;
}

export interface Metadata {
  displayColumn: string;
  primaryColumn: string;
  columns: ColumnMeta[];
  tableType: string;
  geometryType?: GeometryType;
  renderer?: RendererMeta;
  layerConfig?: {
    [key: string]: any;
  };
}

export enum GeometryType {
  Polygon = 'Polygon',
  Polyline = 'Polyline',
  Point = 'Point',
}
export const RouteMetadata = () => target => {
  new RouteMedataFactory(target).create();
};

export class RouteMedataFactory {
  constructor(private target) {}
  static async getMetadata(repo: Repository<any>): Promise<Metadata> {
    const columns = [];

    function getColumnType(type: string | Function) {
      return (type === Number
        ? 'float'
        : type === String
        ? 'nvarchar'
        : type === Date
        ? 'date'
        : type) as string;
    }

    const allColumns = getMetadataArgsStorage().columns;

    const metadatas = allColumns.filter(f => f.target === repo.target);

    repo.metadata.columns.forEach(columnMeta => {
      const metadata = metadatas.find(
        f => f.propertyName === columnMeta.propertyName,
      );

      if (columnMeta.type === 'geometry') {
        return;
      }
      const column = {
        name: columnMeta.propertyName,
        alias:
          (metadata && (metadata.options as ColumnOptions).alias) ||
          columnMeta.propertyName,
        type: getColumnType(columnMeta.type),
        isNullable: columnMeta.isNullable,
        isPrimary: columnMeta.isPrimary,
        isDisplayColumn: metadata
          ? Boolean((metadata.options as ColumnOptions).isDisplayColumn)
          : false,
        isCreateDate: columnMeta.isCreateDate,
        isGenerated: columnMeta.isGenerated,
        readonly: columnMeta.isCreateDate || columnMeta.isGenerated,
      };
      if (columnMeta.relationMetadata) {
        const relationMetadatas = allColumns.filter(
          f =>
            (typeof f.target === 'string' &&
              typeof columnMeta.relationMetadata.type === 'string' &&
              f.target === columnMeta.relationMetadata.type) ||
            (typeof f.target === 'function' &&
              typeof columnMeta.relationMetadata.type === 'string' &&
              f.target.name === columnMeta.relationMetadata.type) ||
            (typeof f.target === 'function' &&
              typeof columnMeta.relationMetadata.type === 'function' &&
              (columnMeta.relationMetadata.type.prototype instanceof f.target ||
                f.target === columnMeta.relationMetadata.type)),
        );
        if (relationMetadatas.length) {
          const primaryColumn = relationMetadatas.find(f => f.options.primary);
          if (primaryColumn) {
            const rmtd = relationMetadatas.find(
              f => (f.options as ColumnOptions).isDisplayColumn,
            );
            const displayColumn = rmtd
              ? rmtd.propertyName
              : primaryColumn.propertyName;
            column['relation'] = {
              type: columnMeta.relationMetadata.relationType,
              name: columnMeta.relationMetadata.propertyName,
              primaryColumn: primaryColumn.propertyName,
              displayColumn,
              url: Reflect.getMetadata(
                CONTROLLER_PATH_ENTITY,
                primaryColumn.target,
              ),
            };
          }
        }
      }
      columns.push(column);
    });

    repo.metadata.oneToManyRelations.forEach(columnMeta => {
      const relationMetadatas = allColumns.filter(
        f => f.target === columnMeta.type,
      );
      const primaryColumn = relationMetadatas.find(f => f.options.primary)
        .propertyName;
      const rmtd = relationMetadatas.find(
        f => (f.options as ColumnOptions).isDisplayColumn,
      );
      const displayColumn = rmtd ? rmtd.propertyName : primaryColumn;
      const column = {
        name: columnMeta.propertyName,
        alias: columnMeta.propertyName,
        type: getColumnType(columnMeta.type),
        isNullable: false,
        isPrimary: false,
        isCreateDate: false,
        isGenerated: false,
        readonly: false,
        relation: {
          primaryColumn,
          displayColumn,
          type: columnMeta.relationType,
          name: columnMeta.propertyName,
          url: Reflect.getMetadata(CONTROLLER_PATH_ENTITY, columnMeta.type),
        },
      };
      columns.push(column);
    });
    const geoCol = repo.metadata.columns.find(s => s.type === 'geometry');
    const mtd = metadatas.find(
      f => (f.options as ColumnOptions).isDisplayColumn,
    );

    const result: Metadata = {
      displayColumn: mtd
        ? mtd.propertyName
        : repo.metadata.primaryColumns[0].propertyName,
      primaryColumn: repo.metadata.primaryColumns[0].propertyName,
      columns,
      tableType: geoCol ? 'gis' : 'standard',
    };
    if (geoCol) {
      result['geometryType'] =
        geoCol.spatialFeatureType &&
        (geoCol.spatialFeatureType.replace('Geometry', '') as GeometryType);
      const metadata = metadatas.find(
        f => f.propertyName === geoCol.propertyName,
      );
      if (
        metadata &&
        metadata.options &&
        (metadata.options as ColumnOptions).renderer
      ) {
        result['renderer'] = JSON.parse(
          (metadata.options as ColumnOptions).renderer,
        );
      }
      try {
        const layerEntity = await getRepository(LayerEntity).findOne({
          where: { layerId: repo.metadata.tableName },
        });
        if (layerEntity) {
          const config = layerEntity.config as any;
          result.layerConfig = config;
          Object.assign(result, config);
        }
      } catch (error) {}
    }
    result['srs'] = moduleOptions.srs;
    return result;
  }
  create() {
    const options = Reflect.getMetadata(CRUD_OPTIONS_METADATA, this.target);
    Reflect.defineMetadata(
      CONTROLLER_PATH_ENTITY,
      Reflect.getMetadata(PATH_METADATA, this.target),
      options.model.type,
    );

    this.target.prototype.getMetadataBase = function() {
      const service = this.service;
      return RouteMedataFactory.getMetadata(service.repo);
    };

    let getOneBasePath: string;

    const getOneBaseOld = this.target.prototype.getOneBase;

    if (this.target.prototype.getOneBase) {
      getOneBasePath = Reflect.getMetadata(
        PATH_METADATA,
        this.target.prototype.getOneBase,
      );
      delete this.target.prototype.getOneBase;
    }
    Get('/metadata')(this.target, null, {
      value: this.target.prototype.getMetadataBase,
    });

    if (getOneBasePath) {
      this.target.prototype.getOneBase = getOneBaseOld;
      Get(getOneBasePath)(this.target, null, {
        value: this.target.prototype.getOneBase,
      });
    }
  }
}

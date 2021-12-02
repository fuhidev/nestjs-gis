import { TypeOrmCrudService as BaseTypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as arcgis from 'terraformer-arcgis-parser';
import * as wkt from 'terraformer-wkt-parser';
import { SelectQueryBuilder, Repository, DeepPartial } from 'typeorm';
import {
  CreateManyDto,
  CrudRequestOptions,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { Geometry } from 'terraformer-arcgis-parser';
import {
  FilterGeoBody,
  GISCrudRequest,
  GISEntity,
  GISParsedRequestParams,
} from './typeorm.interface';
import { SpatialReference } from '../arcgis/interfaces/spatial-reference';
import { GeometryTypeEnum } from '../arcgis/interfaces/arcgis-geometry.interface';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ProjectGeometryService } from '../project-geometry/project-geometry.service';
import { moduleOptions } from '../token';
import { BadRequestException } from '@nestjs/common';

export class GISTypeOrmCrudService<T> extends BaseTypeOrmCrudService<T> {
  protected geometryService = new ProjectGeometryService();
  constructor(repo: Repository<T>) {
    super(repo);
  }

  /**
   * Create TypeOrm QueryBuilder
   * @param parsed
   * @param options
   * @param many
   */
  public async createBuilder(
    parsed: GISParsedRequestParams,
    options: CrudRequestOptions,
    many = true,
  ): Promise<SelectQueryBuilder<T>> {
    // create query builder
    const builder = await super.createBuilder(parsed, options, many);
    if (parsed.filterGeo && parsed.filterGeo.geometry) {
      await this.setAndWhereFilterGeo(builder, parsed.filterGeo);
    }
    if (parsed.bbox) {
      await this.setAndWhereBBox(builder, parsed.bbox);
    }
    return builder;
  }

  private async setAndWhereFilterGeo(
    builder: SelectQueryBuilder<T>,
    filterGeo: FilterGeoBody,
  ) {
    const geoColumn = this.getGeometryColumn();
    let geoFilter: arcgis.Geometry;
    if (filterGeo.fGeo === 'geojson') {
      geoFilter = arcgis.convert(filterGeo.geometry as GeoJSON.GeometryObject);
    } else {
      geoFilter = filterGeo.geometry as arcgis.Geometry;
    }
    let geometryType: GeometryTypeEnum;
    if ((geoFilter as Object).hasOwnProperty('rings')) {
      geometryType = GeometryTypeEnum.Polygon;
    } else if ((geoFilter as Object).hasOwnProperty('paths')) {
      geometryType = GeometryTypeEnum.Polyline;
    } else if ((geoFilter as Object).hasOwnProperty('x')) {
      geometryType = GeometryTypeEnum.Point;
    }
    const { geometries } = await this.geometryService.project({
      inSR:
        filterGeo.fGeo === 'esri'
          ? (geoFilter as arcgis.Geometry).spatialReference
          : 4326,
      geometryType,
      geometries: [geoFilter],
    });
    geoFilter = geometries[0];
    let wktGeo = wkt.convert(arcgis.parse(geoFilter));
    if (wktGeo) {
      const where = `${geoColumn.propertyName}.STIntersects('${wktGeo}') = 1`;
      if (builder.getSql().search('WHERE') === -1) builder.where(where);
      else builder.andWhere(where);
    }
    return builder;
  }

  private async setAndWhereBBox(
    builder: SelectQueryBuilder<T>,
    bbox: arcgis.Envelope,
  ) {
    const geoColumn = this.getGeometryColumn();

    const { geometries } = await this.geometryService.project({
      inSR: bbox.spatialReference,
      geometryType: 'esriGeometryEnvelope' as any,
      geometries: [bbox],
    });
    const pGeo = geometries[0] as arcgis.Polygon;
    let wktGeo = wkt.convert(arcgis.parse(pGeo));
    if (wktGeo) {
      const alias = this.alias ? this.alias + '.' : '';
      const where = `${alias}${
        geoColumn.propertyName
      }.STIntersects('${wktGeo}') = 1`;
      if (builder.getSql().search('WHERE') === -1) builder.where(where);
      else builder.andWhere(where);
    }
    return builder;
  }

  /**
   * depends on paging call `SelectQueryBuilder#getMany` or `SelectQueryBuilder#getManyAndCount`
   * helpful for overriding `TypeOrmCrudService#getMany`
   * @see getMany
   * @see SelectQueryBuilder#getMany
   * @see SelectQueryBuilder#getManyAndCount
   * @param builder
   * @param query
   * @param options
   */
  protected async doGetMany(
    builder: SelectQueryBuilder<T>,
    query: GISParsedRequestParams,
    options: CrudRequestOptions,
  ): Promise<GetManyDefaultResponse<T> | T[]> {
    const isPagi = this.decidePagination(query, options);
    const result = await super.doGetMany(builder, query, options);
    let data: T[] = [];
    if (isPagi) {
      data = (result as any).data;
    } else {
      data = result as T[];
    }
    // nếu dữ liệu có trường kiểu geometry
    if (
      query.fields.length === 0 ||
      query.fields.indexOf(this.getGeometryColumn().propertyName) > -1
    )
      await this.convertGeometryToArcgis(data, query.outSR, query.fGeo);
    return result;
  }

  private async convertGeometryToArcgis(
    data: T[],
    outSR: SpatialReference | number,
    fgeo: string,
  ) {
    const geometries: Array<Geometry> = [];
    const geoColumn = this.getGeometryColumn();
    if (!geoColumn.spatialFeatureType)
      throw new Error(
        'Không xác định được spatialFeatureType của column' +
          geoColumn.propertyName,
      );
    for (const d of data) {
      geometries.push(d[geoColumn.propertyName]);
    }
    if (outSR) {
      const pGeometries = (await this.geometryService.project({
        outSR: outSR,
        geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
        geometries,
      })).geometries;

      let index = 0;
      pGeometries.forEach(pgeo => {
        let gData = data[index];
        if (gData[geoColumn.propertyName]) {
          gData[geoColumn.propertyName] = pgeo;
        }
        index++;
      });
    }

    if (fgeo === 'geojson') {
      for (const d of data) {
        if (d[geoColumn.propertyName]) {
          d[geoColumn.propertyName] = arcgis.parse(d[geoColumn.propertyName]);
        }
      }
    }
  }

  async getOne(crud: GISCrudRequest) {
    const result = await super.getOne(crud);
    await this.convertGeometryToArcgis(
      [result],
      crud.parsed.outSR,
      crud.parsed.fGeo,
    );
    return result;
  }

  async createOne(req: GISCrudRequest, dto: DeepPartial<T>) {
    const geoColumn = this.getGeometryColumn();
    let shape = dto[geoColumn.propertyName];
    if (shape) {
      if (req.parsed.fGeo === 'geojson') {
        shape = arcgis.convert(shape);
      }
      // đổi hệ tọa độ
      if (
        moduleOptions.srs &&
        moduleOptions.srs.wkt !== shape.spatialReference.wkt
      ) {
        const { geometries } = await this.geometryService.project({
          inSR: shape.spatialReference,
          outSR: moduleOptions.srs,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: [shape],
        });
        if (geometries.length) {
          shape = geometries[0];
        } else {
          throw new Error('Không thể chuyển hệ tọa độ, vui lòng thử lại');
        }
      }
    }
    dto[geoColumn.propertyName] = shape;
    if (
      this.repo.metadata.columns.some(
        f => f.databaseName.toLowerCase() === 'objectid',
      )
    ) {
      const [lastEntity] = await this.repo.find({
        order: {
          objectId: 'DESC',
        } as any,
        take: 1,
      });
      const objectId = lastEntity ? (lastEntity as any).objectId + 1 : 1;
      (dto as any).objectId = objectId;
    }

    const result = await super.createOne(req, dto);
    if (req.parsed.fGeo === 'geojson') {
      if (result[geoColumn.propertyName]) {
        const { geometries } = await this.geometryService.project({
          inSR: moduleOptions.srs,
          outSR: 4326,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: [result[geoColumn.propertyName]],
        });
        if (geometries.length) {
          result[geoColumn.propertyName] = arcgis.parse(geometries[0]);
        }
      }
    }
    return result;
  }
  async createMany(req: GISCrudRequest, dto: CreateManyDto<DeepPartial<T>>) {
    const geoColumn = this.getGeometryColumn();
    if (req.parsed.fGeo === 'geojson') {
      dto.bulk.forEach(d => {
        d['shape'] = arcgis.parse(d['shape']);
      });

      const inSR = dto.bulk[0]['shape'].spatialReference;
      // đổi hệ tọa độ
      const { geometries } = await this.geometryService.project({
        inSR,
        outSR: moduleOptions.srs,
        geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
        geometries: dto.bulk.map(m => m['shape']) as arcgis.Geometry[],
      });
      geometries.forEach((geo, idx) => (dto.bulk[idx]['shape'] = geo));
    }

    if (
      this.repo.metadata.columns.some(
        f => f.databaseName.toLowerCase() === 'objectid',
      )
    ) {
      const [lastEntity] = await this.repo.find({
        order: {
          objectId: 'DESC',
        } as any,
        take: 1,
      });
      const objectId = lastEntity ? (lastEntity as any).objectId + 1 : 1;
      (dto as any).objectId = objectId;
    }

    const result = await super.createMany(req, dto);
    if (req.parsed.fGeo === 'geojson') {
      if (result[geoColumn.propertyName]) {
        const { geometries } = await this.geometryService.project({
          inSR: moduleOptions.srs,
          outSR: 4326,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: [result[geoColumn.propertyName]],
        });
        if (geometries.length) {
          result[geoColumn.propertyName] = arcgis.parse(geometries[0]);
        }
      }
    }
    return result;
  }

  async updateOne(req: GISCrudRequest, dto: DeepPartial<T>) {
    const geoColumn = this.getGeometryColumn();
    let shape = dto[geoColumn.propertyName];
    if (shape) {
      if (req.parsed.fGeo === 'geojson') {
        shape = arcgis.convert(shape);
      }
      // đổi hệ tọa độ
      const { geometries } = await this.geometryService.project({
        inSR: shape.spatialReference,
        outSR: moduleOptions.srs,
        geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
        geometries: [shape],
      });
      if (geometries.length) {
        dto[geoColumn.propertyName] = geometries[0];
      } else {
        throw new Error('Không thể chuyển hệ tọa độ, vui lòng thử lại');
      }
    }

    const result = await super.updateOne(req, dto);
    if (req.parsed.fGeo === 'geojson') {
      if (result[geoColumn.propertyName]) {
        const { geometries } = await this.geometryService.project({
          inSR: moduleOptions.srs,
          outSR: 4326,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: [result[geoColumn.propertyName]],
        });
        if (geometries.length) {
          result[geoColumn.propertyName] = arcgis.parse(geometries[0]);
        }
      }
    }
    return result;
  }

  private getGeometryColumn(): ColumnMetadata {
    return this.repo.metadata.columns.find(
      column =>
        this.repo.metadata.connection.driver.spatialTypes.indexOf(
          column.type,
        ) !== -1,
    );
  }

  async executeSql(params: { query: string }) {
    if (!params.query.length) {
      throw new BadRequestException('Không xác định được lệnh');
    }
    try {
      const query = `UPDATE ${this.repo.metadata.tableName} ${params.query}`;
      await this.repo.query(query);
    } catch (error) {
      throw new BadRequestException(error.driverError.originalError.message);
    }
  }
}

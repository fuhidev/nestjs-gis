import { BadRequestException } from '@nestjs/common';
import {
  CreateManyDto,
  CrudRequest,
  CrudRequestOptions,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { TypeOrmCrudService as BaseTypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as arcgis from 'terraformer-arcgis-parser';
import { Geometry } from 'terraformer-arcgis-parser';
import * as wkt from 'terraformer-wkt-parser';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { GeometryTypeEnum } from '../geometry/arcgis/interfaces/arcgis-geometry.interface';
import { SpatialReference } from '../geometry/arcgis/interfaces/spatial-reference';
import { ProjectGeometryService } from '../geometry/project-geometry/project-geometry.service';
import { moduleOptions } from '../token';
import {
  FilterGeoBody,
  GetCountGroupParam,
  GISCrudRequest,
  GISParsedRequestParams,
  SpatialMethodEnum,
} from './typeorm.interface';

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

    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'createBuilder', [
        builder,
        ...arguments,
      ]);
    }

    return builder;
  }

  protected async setAndWhereFilterGeo(
    builder: SelectQueryBuilder<T>,
    filterGeo: FilterGeoBody,
    pAlias = this.alias,
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
      const stMethod =
        filterGeo.method === SpatialMethodEnum.Within
          ? 'STWithin'
          : filterGeo.method === SpatialMethodEnum.Touches
          ? 'STTouches'
          : 'STIntersects';
      const alias = pAlias ? pAlias + '.' : '';
      const where = `${alias}${
        geoColumn.propertyName
      }.${stMethod}('${wktGeo}') = 1`;
      if (builder.getSql().search('WHERE') === -1) builder.where(where);
      else builder.andWhere(where);
    }
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(
        this,
        'setAndWhereFilterGeo',
        arguments,
      );
    }
    return builder;
  }

  protected async setAndWhereBBox(
    builder: SelectQueryBuilder<T>,
    bbox: arcgis.Envelope,
    pAlias = this.alias,
  ) {
    const geoColumn = this.getGeometryColumn();

    const { geometries } = await this.geometryService.project({
      inSR: bbox.spatialReference,
      geometryType: GeometryTypeEnum.Envelope,
      geometries: [bbox],
    });
    const pGeo = geometries[0] as arcgis.Polygon;
    let wktGeo = wkt.convert(arcgis.parse(pGeo));
    if (wktGeo) {
      const alias = pAlias ? pAlias + '.' : '';
      const where = `${alias}${
        geoColumn.propertyName
      }.STIntersects('${wktGeo}') = 1`;
      if (builder.getSql().search('WHERE') === -1) builder.where(where);
      else builder.andWhere(where);
    }
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(
        this,
        'setAndWhereBBox',
        arguments,
      );
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
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'doGetMany', arguments);
    }
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
    if (!this.equalSrs(outSR, moduleOptions.srs)) {
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

    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(
        this,
        'convertGeometryToArcgis',
        arguments,
      );
    }
  }

  async getOne(crud: GISCrudRequest) {
    const result = await super.getOne(crud);
    if (
      crud.parsed.fields.length === 0 ||
      crud.parsed.fields.indexOf(this.getGeometryColumn().propertyName) > -1
    )
      await this.convertGeometryToArcgis(
        [result],
        crud.parsed.outSR,
        crud.parsed.fGeo,
      );

    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'getOne', [
        result,
        ...arguments,
      ]);
    }
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
      if (!this.equalSrs(req.parsed.inSR, moduleOptions.srs)) {
        const { geometries } = await this.geometryService.project({
          inSR: req.parsed.inSR,
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

    let entity = this.prepareEntityBeforeSave(dto, req.parsed);
    if (!entity) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }
    {
      if (this.repo.metadata.primaryColumns.length === 0) {
        this.throwBadRequestException('Lớp không có khóa chính');
      }
      if (this.repo.metadata.primaryColumns.length > 1) {
        this.throwBadRequestException(
          'Chưa hỗ trợ lớp có nhiều hơn một khóa chính',
        );
      }
      const primaryCol = await this.getPrimaryCol();
      if (this.isEsriClass(primaryCol)) {
        const objectId = await this.generateEsriObjectId();
        dto[primaryCol.propertyName] = objectId;
      }
    }

    const primaryKeyVal = dto[this.getPrimaryParam(req.options)] as
      | string
      | number;
    entity = await this.repo.findOne(primaryKeyVal);
    if (entity) {
      throw new BadRequestException('Đã tồn tại khóa chính');
    }

    const result = await super.createOne(req, dto);
    if (result[geoColumn.propertyName]) {
      if (!this.equalSrs(req.parsed.outSR, moduleOptions.srs)) {
        const { geometries } = await this.geometryService.project({
          inSR: moduleOptions.srs,
          outSR: req.parsed.outSR,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: [result[geoColumn.propertyName]],
        });
        if (geometries.length) {
          result[geoColumn.propertyName] = geometries[0];
        }
      }

      if (req.parsed.fGeo === 'geojson') {
        result[geoColumn.propertyName] = arcgis.parse(
          result[geoColumn.propertyName],
        );
      }
    }
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'createOne', [
        result,
        ...arguments,
      ]);
    }
    return result;
  }
  private isEsriClass(primaryCol: ColumnMetadata) {
    return primaryCol.databaseName === 'OBJECTID' && !primaryCol.isGenerated;
  }

  private async generateEsriObjectId() {
    try {
      const result: Array<{ objectId: number }> = await this.repo.query(`
      DECLARE @owner varchar(10)
      SET @owner = (
      select TOP 1 owner  from SDE_table_registry str where table_name ='${
        this.repo.metadata.tableName
      }'
      )

      declare @rowid int
      EXEC next_rowid @owner, '${this.repo.metadata.tableName}' ,@rowid output
      select objectId = @rowid`);
      if (result.length) {
        const objectId = result[0].objectId;
        //@ts-ignore
        return objectId;
      }
    } catch (error) {
      throw new BadRequestException('Không lấy được objectId từ dữ liệu GIS');
    }
  }
  private async getPrimaryCol() {
    const primaryCol = this.repo.metadata.primaryColumns[0];

    // nếu objectId không tự tạo giá trị có nghĩa objectId được tạo từ Arcmap
    // vì vậy phải sử dụng procedure của arcmap trong sql để lấy objectId
    let isGenerated = false;
    try {
      const response = await this.repo.manager
        .createQueryBuilder()
        .from('INFORMATION_SCHEMA.COLUMNS', 'i')
        .select(
          `COLUMNPROPERTY(object_id(TABLE_SCHEMA+'.'+TABLE_NAME), COLUMN_NAME, 'IsIdentity')`,
          'value',
        )
        .where('i.TABLE_NAME = :tableName and i.COLUMN_NAME = :columnName', {
          tableName: this.repo.metadata.tableName,
          columnName: primaryCol.databaseName,
        })
        .getRawOne();
      isGenerated = response.value;
      if (isGenerated) {
        primaryCol.isGenerated = true;
        primaryCol.generationStrategy = 'increment';
      }
    } catch (error) {
      throw new BadRequestException(
        'Không xác định được IDENTITY của PRIMARY KEY',
      );
    }
    return primaryCol;
  }

  async createMany(req: GISCrudRequest, dto: CreateManyDto<DeepPartial<T>>) {
    /* istanbul ignore if */
    if (typeof dto !== 'object' || !Array.isArray(dto.bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = dto.bulk
      .map(one => this.prepareEntityBeforeSave(one, req.parsed))
      .filter(d => d !== undefined);

    /* istanbul ignore if */
    if (!bulk.length) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const geoColumn = this.getGeometryColumn();
    const primaryCol = await this.getPrimaryCol();
    let hasGeoData = bulk[0][geoColumn.propertyName];
    if (hasGeoData) {
      if (req.parsed.fGeo === 'geojson') {
        bulk.forEach(d => {
          d[geoColumn.propertyName] = arcgis.convert(d[geoColumn.propertyName]);
        });
      }

      // neu khac he toa do thi chuyen he toa do
      if (!this.equalSrs(req.parsed.inSR, moduleOptions.srs)) {
        // đổi hệ tọa độ
        const { geometries } = await this.geometryService.project({
          inSR: req.parsed.inSR,
          outSR: moduleOptions.srs,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: bulk.map(m => m['shape']) as arcgis.Geometry[],
        });
        geometries.forEach((geo, idx) => (bulk[idx]['shape'] = geo));
      }

      if (this.isEsriClass(primaryCol)) {
        const promises = [];
        bulk.forEach((d: any) => {
          const promise = this.generateEsriObjectId().then(
            objectId => (d[primaryCol.propertyName] = objectId),
          );
          promises.push(promise);
        });
        await Promise.all(promises);
      }
    }

    const result = await super.createMany(req, { bulk });

    if (
      !req.parsed.fields.length ||
      req.parsed.fields.includes(geoColumn.propertyName)
    ) {
      let data = result;
      if (!this.equalSrs(req.parsed.outSR, moduleOptions.srs)) {
        const { geometries } = await this.geometryService.project({
          inSR: moduleOptions.srs,
          outSR: req.parsed.outSR,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: data.map(d => d[geoColumn.propertyName]),
        });
        if (geometries.length) {
          geometries.forEach((geo, idx) => {
            data[idx][geoColumn.propertyName] = geo;
          });
        }
      }

      if (req.parsed.fGeo === 'geojson') {
        data.forEach(d => {
          if (d[geoColumn.propertyName])
            d[geoColumn.propertyName] = arcgis.parse(d[geoColumn.propertyName]);
        });
      }
    }
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'createMany', [
        result,
        ...arguments,
      ]);
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
      if (!this.equalSrs(req.parsed.inSR, moduleOptions.srs)) {
        const { geometries } = await this.geometryService.project({
          inSR: req.parsed.inSR,
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
    }

    const result = await super.updateOne(req, dto);
    if (result[geoColumn.propertyName]) {
      if (!this.equalSrs(req.parsed.outSR, moduleOptions.srs)) {
        const { geometries } = await this.geometryService.project({
          inSR: moduleOptions.srs,
          outSR: req.parsed.outSR,
          geometryType: geoColumn.spatialFeatureType as GeometryTypeEnum,
          geometries: [result[geoColumn.propertyName]],
        });
        if (geometries.length) {
          result[geoColumn.propertyName] = geometries[0];
        }
      }

      if (req.parsed.fGeo === 'geojson') {
        result[geoColumn.propertyName] = arcgis.parse(
          result[geoColumn.propertyName],
        );
      }
    }

    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'updateOne', [
        result,
        ...arguments,
      ]);
    }
    return result;
  }

  getGeometryColumn(): ColumnMetadata {
    return this.repo.metadata.columns.find(
      column =>
        this.repo.metadata.connection.driver.spatialTypes.indexOf(
          column.type,
        ) !== -1,
    );
  }

  async deleteOne(req: CrudRequest): Promise<void | T> {
    const result = await super.deleteOne(req);
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'deleteOne', [
        ...arguments,
      ]);
    }
    return result;
  }

  async executeSql(params: { query: string }) {
    if (!params.query.length) {
      throw new BadRequestException('Không xác định được lệnh');
    }
    try {
      const query = `UPDATE ${this.repo.metadata.tableName} ${params.query}`;
      if (moduleOptions.hook && moduleOptions.hook.crudService) {
        await moduleOptions.hook.crudService.call(this, 'executeQuery', [
          query,
          ...arguments,
        ]);
      }
      await this.repo.query(query);
    } catch (error) {
      throw new BadRequestException(error.driverError.originalError.message);
    }
  }

  equalSrs(srs1?: number | SpatialReference, srs2?: number | SpatialReference) {
    if (typeof srs1 === 'number' && typeof srs2 === 'number') {
      return srs1 === srs2;
    } else if (typeof srs1 === 'object' && typeof srs2 === 'number') {
      srs1 = srs1 as SpatialReference;
      if (srs2 === srs1.wkid) {
        return true;
      }
    } else if (typeof srs2 === 'object' && typeof srs1 === 'number') {
      srs2 = srs2 as SpatialReference;
      if (srs1 === srs2.wkid) {
        return true;
      }
    } else if (typeof srs1 === 'object' && typeof srs2 === 'object') {
      srs1 = srs1 as SpatialReference;
      srs2 = srs2 as SpatialReference;
      if (srs1.wkid === srs2.wkid) {
        return true;
      }
      if (srs1.wkt === srs2.wkt) {
        return true;
      }
    }
    return false;
  }

  async getCountGroup(params: GetCountGroupParam) {
    const builder = await this.createBuilder(params.parsed, params.options);
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'getCountGroup', [
        builder,
        ...arguments,
      ]);
    }
    const count = await builder.getCount();
    return {
      count,
    };
  }
  async getCount(req: GISCrudRequest) {
    const builder = await this.createBuilder(req.parsed, req.options);
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'getCount', [
        builder,
        ...arguments,
      ]);
    }
    const count = await builder.getCount();
    return {
      count,
    };
  }
  async getSum(req: GISCrudRequest) {
    if (!req.parsed.fields.length) {
      return {
        sum: 0,
      };
    }
    const builder = await this.createBuilder(req.parsed, req.options);
    if (moduleOptions.hook && moduleOptions.hook.crudService) {
      await moduleOptions.hook.crudService.call(this, 'getSum', [
        builder,
        ...arguments,
      ]);
    }
    builder.select(`sum(${req.parsed.fields[0]})`, 'sum');
    const result = await builder.getRawOne();
    return {
      sum: result.sum,
    };
  }
}

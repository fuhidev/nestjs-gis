import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LayerEntity } from './layer.entity';
import {
  InjectRepository,
  InjectEntityManager,
  InjectConnection,
} from '@nestjs/typeorm';
import {
  EntityManager,
  DeepPartial,
  QueryRunner,
  Connection,
  Table,
  TableColumn,
  Repository,
} from 'typeorm';
import { CrudRequest, CreateManyDto } from '@nestjsx/crud';
import {
  ColumnEntity,
  SYSColumnEntity,
  TableSysColumn,
} from '../column/column.entity';
import { getDatabaseName } from '../../utils/database.util';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';
import { GeometryTypeEnum } from '../../geometry';

@Injectable()
export class LayerService extends TypeOrmCrudService<LayerEntity> {
  constructor(
    @InjectConnection() private con: Connection,
    @InjectRepository(LayerEntity) repo,
    @InjectEntityManager() public entityManager: EntityManager,
    @InjectRepository(SYSColumnEntity)
    private columnRepo: Repository<SYSColumnEntity>,
  ) {
    super(repo);
  }

  createBuilderGDB() {
    const builder = this.entityManager
      .createQueryBuilder()
      .from('GDB_ITEMS', 'a')
      .leftJoinAndSelect('GDB_ITEMTYPES', 'b', 'a.Type=b.UUID')
      .leftJoinAndSelect('GDB_ITEMRELATIONSHIPS', 'c', 'a.UUID=c.DestId')
      .leftJoinAndSelect('GDB_ITEMS', 'd', 'c.OriginID=d.UUID')
      .where(`b.Name='Feature Class'`)
      .select('a.Name', 'layerId')
      .addSelect(
        `a.Definition.value('(/DEFeatureClassInfo/Name)[1]','nvarchar(max)')`,
        'layerName',
      )
      .addSelect(
        `a.Definition.value('(/DEFeatureClassInfo/ShapeType)[1]','nvarchar(255)')`,
        'geometryType',
      )
      .addSelect(
        `a.Definition.value('(/DEFeatureClassInfo/Versioned)[1]','nvarchar(255)')`,
        'hasVersion',
      )
      .addSelect('d.Name', 'datasetId')
      .orderBy('a.Name');
    return builder;
  }

  async getManyGDB(req?: CrudRequest): Promise<LayerEntity[]> {
    const { parsed, options } = req;
    const databaseName: string = (await this.entityManager.query(
      `select top 1 databaseName = database_name+'.'+owner+'.' from SDE_table_registry`,
    ))[0].databaseName;
    // this.createBuilder(req.parsed,req.options)
    const builder = this.createBuilderGDB();
    if (parsed.filter.some(f => f.field === 'datasetId')) {
      const fi = parsed.filter.find(f => f.field === 'datasetId');
      builder.andWhere(`d.Name = :datasetId`, { datasetId: fi.value });
    }
    if (parsed.filter.some(f => f.field === 'notExist')) {
      const fi = parsed.filter.find(f => f.field === 'notExist');
      if (fi.value) {
        builder.andWhere(`not exists (select layerId 
            from ${this.repo.metadata.tableName}
            where '${databaseName}'+layerId = a.Name
            )`);
      }
    }
    const data = await builder.execute();
    return data;
  }

  async getOneGDB(layerId: string) {
    const builder = this.createBuilderGDB();
    builder.take(1).andWhere(`a.Name like '%${layerId}'`);
    const data = await builder.execute();
    if (data.length) {
      const d = data[0];
      return d;
    }
    return null;
  }

  async updateAlias(layerId: string, alias: string) {
    // lấy dữ liệu
    // tìm đoạn name để replace
    const builder = this.entityManager.createQueryBuilder();
    builder
      .from('GDB_ITEMS', 'a')
      .innerJoinAndSelect('GDB_ITEMTYPES', 'b', ' a.Type=b.UUID')
      .where(`b.Name='Feature Class'`)
      .andWhere(`a.Name like :name`, { name: '%' + layerId })
      .select('a.UUID', 'id');

    const [entity] = await builder.execute();

    if (entity) {
      const sql = `
        UPDATE GDB_ITEMS
        SET Definition.modify(N'  
              replace value of(/DEFeatureClassInfo/Name/text())[1]  
              with "${alias}" ') 
        where  UUID = @0
        `;
      await this.entityManager.query(sql, [entity.id]);
      return true;
    }
    return false;
  }

  getFields(layerId: string) {
    const sql = `
    select
    name = field.value('Name[1]',
    'nvarchar(255)') ,
    alias = field.value('AliasName[1]',
    'nvarchar(255)') ,
    type = field.value('FieldType[1]',
    'nvarchar(50)') ,
    domainId = field.value('DomainName[1]',
    'nvarchar(255)') ,
    isNullable = field.value('IsNullable[1]',
    'bit')
from
    GDB_ITEMS items CROSS APPLY items.Definition.nodes ('/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx') AS fields(field)
    INNER JOIN GDB_ITEMTYPES types ON items.Type = types.UUID
where
    types.Name = 'Feature Class' and items.Name like @0`;

    return this.entityManager.query(sql, ['%' + layerId]);
  }

  async updateField(layerId: string, fieldId: string, field: ColumnEntity) {
    if (field.hasOwnProperty('alias') || field.hasOwnProperty('domainId')) {
      // nếu là domain thì kiểm tra đã tồn có node DomainName
      // nếu chưa có thì insert
      // nếu = null có nghĩa là delete
      const hasDomain = field.hasOwnProperty('domainId');
      const hasAlias = field.hasOwnProperty('alias');
      if (hasDomain) {
        if (field.domainId === null) {
          const sql = `
          update
            GDB_ITEMS
          set
            Definition.modify('delete /DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"]/DomainName')
          where
            name = @0 and Definition.exist('/DEFeatureClassInfo') = 1
          `;
          await this.entityManager.query(sql, [layerId]);
        } else {
          let builder = this.entityManager.createQueryBuilder();
          builder
            .from('GDB_ITEMS', 'gi')
            .select(
              `gi.Definition.exist('/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name=${fieldId}]/DomainName')`,
              'value',
            )
            .where('gi.Name = :name', { name: layerId })
            .andWhere(`gi.Definition.exist('/DEFeatureClassInfo') = 1`);
          const result = await builder.execute();
          const exist = Boolean(result[0] && result[0].value);
          if (!exist) {
            const sql = `
          UPDATE GDB_ITEMS
          SET Definition.modify('insert DomainName as last into (/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"])[1]')
          where Name=@0 and Definition.exist('/DEFeatureClassInfo') = 1
          `;
            await this.entityManager.query(sql, [layerId, fieldId]);
          }
        }
      }
      if (hasAlias || (hasDomain && field.domainId !== null)) {
        const sql = `
    UPDATE
      GDB_ITEMS
    SET
    ${
      hasAlias
        ? `Definition.modify(N'  
        replace value of(/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"]/AliasName/text())[1]  
        with "${field.alias}" ')`
        : ''
    }
    ${
      hasDomain && field.domainId !== null
        ? `Definition.modify(N'  
        replace value of(/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"]/DomainName/text())[1]  
        with "${field.domainId}" ')`
        : ''
    }
    where
      Name = @0 
      and Definition.exist('/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"]') = 1
`;

        await this.entityManager.query(sql, [layerId]);
      }
      return true;
    } else {
      return false;
    }
  }

  async createMany(
    req: CrudRequest,
    dto: CreateManyDto<DeepPartial<LayerEntity>>,
  ) {
    const dbName = await getDatabaseName(this.entityManager);
    if (dto.bulk.length) {
      dto.bulk.forEach(d => {
        const regex = new RegExp(dbName, 'ig');
        d.datasetId = d.datasetId.replace(regex, '');
        d.layerId = d.layerId.replace(regex, '');
      });
    }
    return super.createMany(req, dto);
  }

  async updateAliasNameFromGDB(params: { lstLayerId: string[] }) {
    const dbName = await getDatabaseName(this.entityManager);
    const { lstLayerId } = params;
    if (lstLayerId.length === 0) {
      throw new BadRequestException('Chưa truyền danh sách layerId');
    }
    const builder = this.createBuilderGDB();
    builder.andWhere(
      `a.Name in (${lstLayerId.map(m => `'${dbName}${m}'`).join(',')})`,
      { layerIds: [] },
    );

    const gdb = (await builder.execute()) as LayerEntity[];

    const entities: LayerEntity[] = gdb.map(m => {
      const regex = new RegExp(dbName, 'ig');
      return this.repo.create({
        layerId: m.layerId.replace(regex, ''),
        layerName: m.layerName,
      });
    });
    return this.repo.save(entities, { chunk: 50 });
  }

  async hasTable(p: { tableName: string }) {
    return this.withQueryRunner(async runner => {
      return {
        has: await runner.hasTable(p.tableName),
      };
    });
  }

  async hasTableOrFailed(p: { tableName: string }) {
    const result = await this.hasTable(p);
    if (!result.has) {
      throw new BadRequestException('Không tồn tại lớp dữ liệu');
    }
    return true;
  }

  createTable(p: TableOptions) {
    return this.withQueryRunner(async runner => {
      if (!p.columns.length) {
        throw new BadRequestException('Table phải có ít nhất một column');
      }
      const primaryCol = p.columns.find(f => f.isPrimary);
      if (!primaryCol) {
        throw new BadRequestException('Table phải có một column là khóa chính');
      }
      if (p.columns.filter(f => f.isPrimary).length > 1) {
        throw new BadRequestException(
          'Table chỉ yêu cầu một column là khóa chính',
        );
      }
      const table = new Table(p);
      try {
        await runner.createTable(table, true);
        return {
          message: 'Tạo thành công table ' + p.name,
          table: await runner.getTable(table.name),
        };
      } catch (error) {
        throw new BadRequestException(
          error && error.originalError
            ? error.originalError.message
            : 'Lỗi truy vấn',
        );
      }
    });
  }

  async changeIsDiplayColumn(p: { table: string; columnDisplay: string }) {
    const { table, columnDisplay } = p;
    await this.hasTableOrFailed({ tableName: table });
    const columnEntities = await this.columnRepo.find({ where: { table } });
    columnEntities.forEach(col => {
      col.isDisplay = false;
    });
    await this.columnRepo.save(columnEntities);
    const columnEntity = await this.getColumnEntity({
      table,
      column: columnDisplay,
    });
    columnEntity.isDisplay = true;
    await this.columnRepo.save(columnEntity);
    return {
      message: 'Cập nhật thành công cột hiển thị',
    };
  }

  async syncColumn(p: { table: string; columns: TableSysColumn[] }) {
    return await this.withQueryRunner(async runner => {
      const { table, columns } = p;
      try {
        const baseColumns = await this.getColumns(p.table);
        const dropColumns: string[] = [];
        const addColumns: TableSysColumn[] = [];
        const alterColumn: TableSysColumn[] = [];
        columns.forEach(col => new TableSysColumn(col));
        baseColumns.forEach(baseCol => {
          if (!columns.some(col => col.name === baseCol.name)) {
            // nếu là cột SHAPE thì không cần sync
            if (!(baseCol.name === 'SHAPE' && baseCol.type === 'geometry'))
              dropColumns.push(baseCol.name);
          } else {
            const col = columns.find(f => f.name === baseCol.name);
            if (
              col.type !== baseCol.type ||
              col.length !== baseCol.length ||
              col.alias !== baseCol.alias ||
              col.isNullable !== baseCol.isNullable ||
              col.joinTable !== baseCol.joinTable ||
              col.joinType !== baseCol.joinType
            ) {
              alterColumn.push(col);
            }
          }
        });
        columns.forEach(col => {
          if (!baseColumns.some(baseCol => col.name === baseCol.name)) {
            addColumns.push(col);
          }
        });

        const promises = [];

        dropColumns.forEach(column => {
          promises.push(this.dropColumn({ table, column }));
        });

        addColumns.forEach(column => {
          promises.push(this.addColumn({ tableName: table, column }));
        });

        alterColumn.forEach(value => {
          this.changeColumn({
            table,
            oldColumn: value.name,
            newColumn: value,
          });
        });

        await Promise.all(promises);

        return {
          message: 'Cập nhật thành công',
          columns: await this.getColumns(p.table),
        };
      } catch (error) {
        throw error;
      }
    });
  }

  async addColumn(p: { tableName: string; column: TableSysColumn }) {
    return this.withQueryRunner(async runner => {
      await runner.addColumn(p.tableName, p.column);
      const columnEntity = await this.getColumnEntity({
        table: p.tableName,
        column: p.column.name,
      });
      columnEntity.alias = p.column.alias;
      columnEntity.isDisplay = p.column.isDisplay;
      await this.columnRepo.save(columnEntity);
      return {
        column: new TableSysColumn({
          ...p.column,
          alias: columnEntity.alias,
          isDisplay: columnEntity.isDisplay,
          ai: columnEntity.ai,
          joinTable: columnEntity.joinTable,
          joinType: columnEntity.joinType,
        }),
      };
    });
  }

  dropColumn(p: { table: string; column: string }) {
    return this.withQueryRunner(async runner => {
      await runner.dropColumn(p.table, p.column);
      const columnEntity = await this.getColumnEntity({
        column: p.column,
        table: p.table,
      });
      await this.columnRepo.delete(columnEntity);
      return {
        message: `Xóa thành công column ${p.column} của table ${p.table}`,
      };
    });
  }
  changeColumn(p: {
    table: string;
    oldColumn: string;
    newColumn: TableSysColumn;
  }) {
    return this.withQueryRunner(async runner => {
      const { table, oldColumn, newColumn } = p;
      await runner.changeColumn(p.table, p.oldColumn, p.newColumn);
      // cập nhật column
      try {
        const columnEntity = await this.getColumnEntity({
          table: p.table,
          column: p.oldColumn,
        });
        try {
          let updateEntity: Partial<SYSColumnEntity> = {};
          if ((newColumn as Object).hasOwnProperty('alias')) {
            updateEntity.alias = newColumn.alias;
          }
          if ((newColumn as Object).hasOwnProperty('joinType')) {
            updateEntity.joinType = newColumn.joinType;
          }
          if ((newColumn as Object).hasOwnProperty('joinTable')) {
            updateEntity.joinTable = newColumn.joinTable;
            // nếu join table không được set giá trị thì joinType cũng không được set giá trị
            // mặc joinType là many-to-one
            if (updateEntity.joinTable) {
              if (!updateEntity.joinType) {
                updateEntity.joinType = 'many-to-one';
              }
            } else {
              updateEntity.joinType = null;
            }
          }

          if (Object.keys(updateEntity).length) {
            await this.columnRepo.update(columnEntity, updateEntity);
          }
        } catch (error) {}
      } catch (error) {}

      return {
        message: `Cập nhật column ${p.newColumn.name} thành công`,
      };
    });
  }
  renameColumn(p: { table: string; oldColumn: string; newColumn: string }) {
    return this.withQueryRunner(async runner => {
      await runner.renameColumn(p.table, p.oldColumn, p.newColumn);
      return {
        message: `Đổi tên thành công`,
      };
    });
  }

  getColumns(tableName: string) {
    return this.withQueryRunner(async runner => {
      const table = await runner.getTable(tableName);
      const result: TableSysColumn[] = table.columns.map(
        val => new TableSysColumn(val),
      );
      // lấy cấu hình từ database
      try {
        const columnEntities = await this.columnRepo.find({
          where: {
            table: tableName,
          },
        });
        result.forEach(tableColumn => {
          const colEntity = columnEntities.find(
            f => f.column == tableColumn.name,
          );
          if (colEntity) {
            tableColumn.alias = colEntity.alias;
            tableColumn.isDisplay = colEntity.isDisplay;
            tableColumn.joinTable = colEntity.joinTable;
            tableColumn.joinType = colEntity.joinType;
          }
        });
      } catch (error) {
        throw new BadRequestException(
          'Không liên kết được cơ sở dữ liệu SYS_Column',
        );
      }
      return result;
    });
  }

  getColumnType() {
    return [
      'int',
      'bigint',
      'decimal',
      'numeric',
      'float',
      'datetime2',
      'varchar',
      'nvarchar',
      'uniqueidentifier',
    ];
  }

  protected async withQueryRunner<T extends any>(
    callback: (queryRunner: QueryRunner) => T,
  ) {
    const queryRunner = this.con.createQueryRunner();
    try {
      return await callback(queryRunner);
    } catch (error) {
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getColumnEntity(p: { table: string; column: string }) {
    let columnEntity = await this.columnRepo.findOne({
      table: p.table,
      column: p.column,
    });
    if (!columnEntity) {
      columnEntity = await this.columnRepo.save(p);
    }
    return columnEntity;
  }

  /**
   * Chuyển đổi lớp table trở thành geomety table hoặc ngược lại
   * @param geometryType nếu null có nghĩa là lớp không phải không gian
   */
  async changeGeometyType(p: {
    layerId: string;
    geometryType: GeometryTypeEnum | null;
  }): Promise<{ message: string }> {
    const { layerId, geometryType } = p;
    await this.hasTableOrFailed({ tableName: layerId });
    const layer = await this.repo.findOne(layerId, {
      select: ['geometryType', 'layerId'],
    });
    if (!layer) {
      throw new BadRequestException(
        `Lớp ${layerId} chưa được cấu hình trong hệ thống`,
      );
    }
    const columns = await this.getColumns(layerId);
    const hasGeometryCol = columns.some(
      s => s.type === 'geometry' && s.name === 'SHAPE',
    );
    // nếu hiện tại lớp là table chuyển thành geometryTable
    // thì thêm cột SHAPE và cập nhật geometryType của SYS_Layer
    if (geometryType) {
      if (!hasGeometryCol) {
        await this.addColumn({
          tableName: layerId,
          column: new TableSysColumn({
            name: 'SHAPE',
            type: 'geometry',
            isNullable: true,
          }),
        });
      }
      if (!layer.geometryType) {
        await this.repo.update(layerId, { geometryType });
        return {
          message: `Đã chuyển đổi ${layerId} từ geometry sang geometry table`,
        };
      }

      // nếu hiện tại lớp là geometryTable chỉ đổi cấu trúc không gian
      // thì xóa hết dữ liệu cột SHAPE và cập nhật geometryType của SYS_Layer
      else if (layer.geometryType && layer.geometryType !== geometryType) {
        if (hasGeometryCol) {
          const builder = this.repo.manager
            .createQueryBuilder()
            .update(layerId)
            .set({ SHAPE: null });

          let sqlGeoType: string[] = [];
          if (geometryType === GeometryTypeEnum.Point) {
            sqlGeoType.push('Point', 'MultiPoint');
          } else if (geometryType === GeometryTypeEnum.Polygon) {
            sqlGeoType.push('Polygon', 'MultiPolygon');
          } else if (geometryType === GeometryTypeEnum.Polyline) {
            sqlGeoType.push('LineString', 'MultiLineString');
          }
          builder.where(
            `SHAPE.STGeometryType() not in (${sqlGeoType
              .map(geo => `'${geo}'`)
              .join(',')})`,
          );
          await builder.execute();
        }
        await this.repo.update(layerId, { geometryType });
        return {
          message: `Đã chuyển đổi ${layerId} từ ${
            layer.geometryType
          } sang ${geometryType}, thuộc tính không gian đã bị xóa hết dữ liệu`,
        };
      }
    }
    // nếu hiện tại lớp là geometryTable chuyển đổi thành table
    // thì xóa cột SHAPE và cập nhật geometryType của SYS_Layer
    else if (layer.geometryType && !geometryType) {
      if (hasGeometryCol)
        await this.dropColumn({ table: layerId, column: 'SHAPE' });
      await this.repo.update(layerId, { geometryType: null });
      return {
        message: `Đã chuyển đổi ${layerId} từ geometry table sang normal table`,
      };
    }
    return {
      message: 'Không có sự thay đổi',
    };
  }
}

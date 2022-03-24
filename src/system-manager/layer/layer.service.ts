import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LayerEntity } from './layer.entity';
import { InjectRepository, InjectEntityManager, InjectConnection } from '@nestjs/typeorm';
import { EntityManager, DeepPartial, QueryRunner, Connection, Table, TableColumn } from 'typeorm';
import { CrudRequest, CreateManyDto } from '@nestjsx/crud';
import { ColumnEntity } from '../column/column.entity';
import { getDatabaseName } from '../../utils/database.util';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';

@Injectable()
export class LayerService extends TypeOrmCrudService<LayerEntity> {
  constructor(
    @InjectConnection() private con: Connection,
    @InjectRepository(LayerEntity) repo,
    @InjectEntityManager() public entityManager: EntityManager
  ) {
    super(repo);
  }

  createBuilderGDB() {
    const builder = this.entityManager.createQueryBuilder()
      .from('GDB_ITEMS', 'a')
      .leftJoinAndSelect('GDB_ITEMTYPES', 'b', 'a.Type=b.UUID')
      .leftJoinAndSelect('GDB_ITEMRELATIONSHIPS', 'c', 'a.UUID=c.DestId')
      .leftJoinAndSelect('GDB_ITEMS', 'd', 'c.OriginID=d.UUID')
      .where(`b.Name='Feature Class'`)
      .select('a.Name', 'layerId')
      .addSelect(`a.Definition.value('(/DEFeatureClassInfo/Name)[1]','nvarchar(max)')`, 'layerName')
      .addSelect(`a.Definition.value('(/DEFeatureClassInfo/ShapeType)[1]','nvarchar(255)')`, 'geometryType')
      .addSelect(`a.Definition.value('(/DEFeatureClassInfo/Versioned)[1]','nvarchar(255)')`, 'hasVersion')
      .addSelect('d.Name', 'datasetId')
      .orderBy('a.Name');
    return builder;
  }

  async getManyGDB(req?: CrudRequest): Promise<LayerEntity[]> {
    const { parsed, options } = req;
    const databaseName: string = (await this.entityManager.query(`select top 1 databaseName = database_name+'.'+owner+'.' from SDE_table_registry`))[0].databaseName;
    // this.createBuilder(req.parsed,req.options)
    const builder = this.createBuilderGDB();
    if (parsed.filter.some(f => f.field === 'datasetId')) {
      const fi = parsed.filter.find(f => f.field === 'datasetId');
      builder.andWhere(`d.Name = :datasetId`, { datasetId: fi.value });
    }
    if (parsed.filter.some(f => f.field === 'notExist')) {
      const fi = parsed.filter.find(f => f.field === 'notExist');
      if (fi.value) {
        builder
          .andWhere(`not exists (select layerId 
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
    builder
      .take(1)
      .andWhere(`a.Name like '%${layerId}'`);
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
      .select('a.UUID', 'id')

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

    return this.entityManager.query(sql, ['%' + layerId])
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
          builder.from('GDB_ITEMS', 'gi')
            .select(`gi.Definition.exist('/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name=${fieldId}]/DomainName')`, 'value')
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
    ${hasAlias ?
            `Definition.modify(N'  
        replace value of(/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"]/AliasName/text())[1]  
        with "${field.alias}" ')` : ''
          }
    ${hasDomain && field.domainId !== null ?
            `Definition.modify(N'  
        replace value of(/DEFeatureClassInfo/GPFieldInfoExs/GPFieldInfoEx[Name="${fieldId}"]/DomainName/text())[1]  
        with "${field.domainId}" ')` : ''
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

  async createMany(req: CrudRequest, dto: CreateManyDto<DeepPartial<LayerEntity>>) {
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

  async updateAliasNameFromGDB(params: {
    lstLayerId: string[]
  }) {
    const dbName = await getDatabaseName(this.entityManager);
    const { lstLayerId } = params;
    if (lstLayerId.length === 0) {
      throw new BadRequestException('Chưa truyền danh sách layerId')
    }
    const builder = this.createBuilderGDB();
    builder.andWhere(`a.Name in (${lstLayerId.map(m => `'${dbName}${m}'`).join(',')})`, { layerIds: [] });

    const gdb = await builder.execute() as LayerEntity[];

    const entities: LayerEntity[] = gdb.map(m => {
      const regex = new RegExp(dbName, 'ig');
      return this.repo.create({
        layerId: m.layerId.replace(regex, ''),
        layerName: m.layerName
      })
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

  createTable(p: TableOptions & { tableType?: 'gis' }) {
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
      if (p.tableType === 'gis') {
        table.addColumn(
          new TableColumn({
            type: 'geometry',
            name: 'SHAPE',
            isNullable: true,
            comment: '',
          }),
        );
      }
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

  async syncColumn(p: { table: string; columns: TableColumn[] }) {
    return await this.withQueryRunner(async runner => {
      try {
        const baseColumns = await this.getColumns(p.table);
        const dropColumns: string[] = [];
        const addColumns: TableColumn[] = [];
        const alterColumn: TableColumn[] = [];
        p.columns.forEach(col => new TableColumn(col));
        baseColumns.forEach(baseCol => {
          if (!p.columns.some(col => col.name === baseCol.name)) {
            dropColumns.push(baseCol.name);
          } else {
            const col = p.columns.find(f => f.name === baseCol.name);
            if (
              col.type !== baseCol.type ||
              col.length !== baseCol.length ||
              col.isNullable !== baseCol.isNullable
            ) {
              alterColumn.push(col);
            }
          }
        });
        p.columns.forEach(col => {
          if (!baseColumns.some(baseCol => col.name === baseCol.name)) {
            addColumns.push(col);
          }
        });

        const promises = [];

        promises.push(runner.dropColumns(p.table, dropColumns));

        promises.push(runner.addColumns(p.table, addColumns));

        promises.push(
          runner.changeColumns(
            p.table,
            //@ts-ignore
            alterColumn.map(col => ({
              oldColumn: col.name,
              newColumn: col,
            })),
          ),
        );

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

  async addColumn(p: {
    tableName: string;
    column: {
      type: string;
      name: string;
      propertyName: string;
      alias: string;
      length: number;
    } & TableColumn;
  }) {
    return this.withQueryRunner(async runner => {
      await runner.addColumn(p.tableName, p.column);
      return { column: new TableColumn(p.column) };
    });
  }

  dropColumn(p: { table: string; column: string }) {
    return this.withQueryRunner(async runner => {
      await runner.dropColumn(p.table, p.column);
      return {
        message: `Xóa thành công column ${p.column} của table ${p.table}`,
      };
    });
  }
  changeColumn(p: {
    table: string;
    oldColumn: string;
    newColumn: TableColumn;
  }) {
    return this.withQueryRunner(async runner => {
      await runner.changeColumn(p.table, p.oldColumn, p.newColumn);
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
      return table.columns;
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
}

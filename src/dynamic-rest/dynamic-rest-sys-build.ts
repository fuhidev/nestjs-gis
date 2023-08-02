import { Logger } from '@nestjs/common';
import { ColumnType, Connection, createConnection, QueryRunner } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { LayerEntity, SYSColumnEntity } from '../system-manager';
import { generateDynamicRest } from './dynamic-rest-build';
import {
  DynamicRestFromSysOptions,
  ITableColumn,
  RestEntity,
  RestEntityColumn,
} from './dynamic-rest.interface';

export async function generateDynamicSysRest(
  options: DynamicRestFromSysOptions,
) {
  const dbConfig = options.dbConfig as SqlServerConnectionOptions;
  const con = await createConnection({
    ...dbConfig,
    name: 'tmpfromsys',
  });
  const restEntities = await convertSysLayer2RestEntities({
    con,
  });
  con.close();
  return generateDynamicRest({
    restEntities,
    dbConfig: options.dbConfig,
  });
}

export async function convertSysLayer2RestEntities(p: { con: Connection }) {
  const { con } = p;
  const logger = new Logger('DynamicRestModule');

  const runner = con.createQueryRunner();
  const restEntities: Array<RestEntity> = [];
  try {
    const builder = con.createQueryBuilder(runner);
    const layerEntities: Array<LayerEntity> = await builder
      .clone()
      .from('SYS_Layer', 'lyr')
      .where('lyr.isAPI = 1')
      .select([
        'layerId = lyr.layerId',
        'url = lyr.url',
        'geometryType=lyr.geometryType',
        'primaryColumn = lyr.primaryColumn',
      ])
      .getRawMany();
    logger.log(`Found ${layerEntities.length} Layer`);

    // Kiểm tra những layer tồn tại
    const layerExists: Array<LayerEntity> = await getHasLayers(
      layerEntities,
      runner,
    );
    const tableNames = layerExists.map(m => m.layerId);
    const tableNameIn = tableNames.map(m => `'${m}'`).join(',');
    logger.log(`Query columns in native database`);
    const dbColumns: Array<ITableColumn> = await runner.query(`
    SELECT
      C.COLUMN_NAME AS name,
      CASE
        WHEN T.CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 1
        ELSE 0
      END AS isPrimary,
      C.TABLE_NAME AS [table],
      C.DATA_TYPE AS [type]
    FROM INFORMATION_SCHEMA.COLUMNS C 
    LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE CU ON
      CU.COLUMN_NAME = C.COLUMN_NAME
      AND CU.TABLE_NAME = C.TABLE_NAME
    LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS T
    ON
      CU.CONSTRAINT_NAME = T.CONSTRAINT_NAME
    WHERE
      C.TABLE_NAME IN (${tableNameIn})
    `);

    logger.log(`Query SYS_Column`);
    const columnEntites: SYSColumnEntity[] = (await builder
      .clone()
      .from('SYS_Column', 'col')
      .where(`col.table IN (${tableNameIn})`)
      .select([
        'col.alias',
        'col.isDisplay',
        'col.joinTable',
        'col.joinType',
        'col.column',
        'col.table',
      ])
      .getMany()) as SYSColumnEntity[];

    layerExists.forEach(layer => {
      const entity = getRestEntity(
        layer,
        columnEntites.filter(
          f => f.table.toUpperCase() === layer.layerId.toUpperCase(),
        ),
        dbColumns.filter(
          f => f.table.toUpperCase() === layer.layerId.toUpperCase(),
        ),
      );
      restEntities.push(entity);
    });

    return restEntities;
  } finally {
    runner.release();
  }
}
async function getHasLayers(layerEntities: LayerEntity[], runner: QueryRunner) {
  const tableNames = layerEntities.map(m => `'${m.layerId}'`).join(',');
  const resp: Array<{ tableName: string }> = await runner.query(
    `SELECT TABLE_NAME as tableName FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME IN (${tableNames})`,
  );
  const layerExists: Array<LayerEntity> = [];
  for (const layer of layerEntities) {
    if (
      resp.some(s => s.tableName.toUpperCase() === layer.layerId.toUpperCase())
    ) {
      layerExists.push(layer);
    }
  }
  return layerExists;
}

function getRestEntity(
  layer: LayerEntity,
  columnEntities: SYSColumnEntity[],
  dbColumns: ITableColumn[],
) {
  const restEntityColumns: RestEntityColumn[] = [];

  dbColumns.forEach(tableColumn => {
    const columnEntity = columnEntities.find(
      f => f.column === tableColumn.name,
    );
    let primaryCol = dbColumns.find(f => f.isPrimary);
    let primaryColName = primaryCol ? primaryCol.name : undefined;
    if (layer.primaryColumn) {
      if (dbColumns.some(s => s.name === layer.primaryColumn)) {
        primaryColName = layer.primaryColumn;
      }
    }
    const restEntityColumn: RestEntityColumn = {
      propertyName: tableColumn.name,
      alias: columnEntity && columnEntity.alias,
      isDisplayColumn: columnEntity && columnEntity.isDisplay,
      primary: primaryColName === tableColumn.name,
      type: tableColumn.type as ColumnType,
    };
    if (tableColumn.type === 'geometry') {
      restEntityColumn.propertyName = 'shape';
      restEntityColumn.spatialFeatureType = layer.geometryType;
    }
    restEntityColumns.push(restEntityColumn);

    if (columnEntity && columnEntity.joinTable && columnEntity.joinType) {
      const restEntityJoinColumn: RestEntityColumn = {
        propertyName: `join${tableColumn.name}`,
        join: {
          joinColumn: { name: tableColumn.name },
          target: columnEntity.joinTable,
          type: columnEntity.joinType,
        },
      };
      restEntityColumns.push(restEntityJoinColumn);
    }
  });
  const restEntity: RestEntity = {
    columns: restEntityColumns,
    path: layer.url,
    tableName: layer.layerId,
  };

  return restEntity;
}

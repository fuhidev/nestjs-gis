import { LayerEntity, SYSColumnEntity } from '../system-manager';
import {
  ColumnType,
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
  getRepository,
} from 'typeorm';
import { generateDynamicRest } from './dynamic-rest-build';
import {
  DynamicRestFromSysOptions,
  RestEntity,
  RestEntityColumn,
} from './dynamic-rest.interface';

export async function generateDynamicSysRest(
  options: DynamicRestFromSysOptions,
) {
    const con =await  createConnection(options.dbConfig as ConnectionOptions);
  const restEntities = await convertSysLayer2RestEntities({
    // dbName: options.sysDbName,
    con 
  });
  con.close();
  return generateDynamicRest({
    restEntities,
    dbConfig: options.dbConfig,
  });
}

export async function convertSysLayer2RestEntities(p: { con:Connection }) {
  const { con } = p;
  
  const runner = con.createQueryRunner();
  const restEntities: Array<RestEntity> = [];
  try {
      const builder = con.createQueryBuilder(runner);
      const layerEntities:Array<LayerEntity> =   await builder.clone().from('SYS_Layer','lyr')
      .where('lyr.isAPI = 1')
      .select([
          'layerId = lyr.layerId',
          'url = lyr.url'
      ]).getRawMany();
    for (const layer of layerEntities) {
      if (await runner.hasTable(layer.layerId)) {
        const restEntityColumns: RestEntityColumn[] = [];
        const table = await runner.getTable(layer.layerId);
        const columnEntities:Array<SYSColumnEntity> = await builder.clone().from('SYS_Column','col')
        .where('col.table=:table',{table:layer.layerId})
        .select(
            ['col.alias','col.isDisplay']
        ).getRawMany()
        table.columns.forEach(tableColumn => {
          const columnEntity = columnEntities.find(
            f => f.column === tableColumn.name,
          );
          const restEntityColumn: RestEntityColumn = {
            propertyName: tableColumn.name,
            alias: columnEntity && columnEntity.alias,
            isDisplayColumn: columnEntity && columnEntity.isDisplay,
            primary: tableColumn.isPrimary,
            type: tableColumn.type as ColumnType,
          };
          restEntityColumns.push(restEntityColumn);
        });
        const restEntity: RestEntity = {
          columns: restEntityColumns,
          path: layer.url,
          tableName: layer.layerId,
        };
        restEntities.push(restEntity);
      }
    }
    return restEntities;
  } finally {
    runner.release();
  }
}

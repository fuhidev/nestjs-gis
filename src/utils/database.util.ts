import { EntityManager } from "typeorm";

export async function getDatabaseName(entityManager: EntityManager) {
  return (await entityManager.query(`select top 1 databaseName = database_name+'.'+owner+'.' from SDE_table_registry`))[0].databaseName;
}
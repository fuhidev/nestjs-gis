import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  Connection,
  getConnection,
  getManager,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private con: Connection) {}
  getHello(): string {
    return 'Hello World!';
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
            comment:'',
            
          }),
        );
      }
      try {
        return await runner.createTable(table, true);
      } catch (error) {
        throw new BadRequestException(
          error && error.originalError
            ? error.originalError.message
            : 'Lỗi truy vấn',
        );
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
      return { column: p.column };
    });
  }

  getColumns(tableName: string) {
    return this.withQueryRunner(async runner => {
      const table = await runner.getTable(tableName);
      runner.release();
      return table.columns;
    });
  }

  getColumnType() {
    return [
      'int',
      'bigint',
      'bit',
      'decimal',
      'money',
      'numeric',
      'smallint',
      'smallmoney',
      'tinyint',
      'float',
      'real',
      'date',
      'datetime2',
      'datetime',
      'datetimeoffset',
      'smalldatetime',
      'time',
      'char',
      'varchar',
      'text',
      'nchar',
      'nvarchar',
      'ntext',
      'binary',
      'image',
      'varbinary',
      'hierarchyid',
      'sql_variant',
      'timestamp',
      'uniqueidentifier',
      'xml',
      'geometry',
      'geography',
      'rowversion',
    ];
  }

  protected async withQueryRunner<T extends any>(
    callback: (queryRunner: QueryRunner) => T,
  ) {
    const queryRunner = this.con.createQueryRunner();
    try {
      return await callback(queryRunner);
    } finally {
      await queryRunner.release();
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, QueryRunner, Table, TableColumn } from 'typeorm';
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
            comment: '',
          }),
        );
      }
      try {
        await runner.createTable(table, true);
        return {
          message: 'Tạo thành công table ' + p.name,
          table :await runner.getTable(table.name),
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

  syncColumn(p: { table: string; columns: TableColumn[] }) {
    return this.withQueryRunner(async runner => {
      const baseColumns = await this.getColumns(p.table);
      const dropColumns: string[] = [];
      const addColumns: TableColumn[] = [];
      const alterColumn: TableColumn[] = [];
      baseColumns.forEach(baseCol => {
        if (!p.columns.some(col => col.name === baseCol.name)) {
          dropColumns.push(baseCol.name);
        } else {
          const col = p.columns.find(f => f.name === baseCol.name);
          if (col.type !== baseCol.type || col.length !== baseCol.length) {
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
          alterColumn.map(col => ({
            oldColumn: col,
            newColumn: col,
          })),
        ),
      );

      await Promise.all(promises);

      return {
        message: 'Cập nhật thành công',
        columns: await this.getColumns(p.table),
      };
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

  dropColumn(p: { table: string; column: string }) {
    return this.withQueryRunner(async runner => {
      await runner.dropColumn(p.table, p.column);
      return {
        message: `Xóa thành công column ${p.column} của table ${p.table}`,
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

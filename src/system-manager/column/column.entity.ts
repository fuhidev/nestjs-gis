import { Column, Entity, JoinColumn, ManyToOne, TableColumn } from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';
import { CodedDomainEntity } from '../coded-domain/coded-domain.entity';
import { LayerEntity } from '../layer/layer.entity';

export interface ColumnEntity {
  id: string;
  name: string;
  alias: string;
  type: string;
  isNullable: boolean;
  domainId: string;
  domain: CodedDomainEntity;
  layerId: string;
  layer: LayerEntity;
}
@Entity('SYS_Column', { synchronize: false })
export class SYSColumnEntity {
  @Column({
    name: 'ID',
    nullable: true,
    primary: true,
    generated: 'increment',
  })
  id: number;

  @Column({ name: 'Table' })
  table: string;
  @Column({ name: 'Alias' })
  alias: string;
  @Column({ name: 'Column' })
  column: string;
  @Column({ name: 'IsDisplay' })
  isDisplay: boolean;
  @Column({ name: 'JoinTable' })
  joinTable: string;
  @JoinColumn({ name: 'JoinTable' })
  @ManyToOne(() => LayerEntity, { onDelete: 'SET NULL' })
  joinTableRef: LayerEntity;
  @Column({ name: 'JoinType', type: 'nvarchar' })
  joinType: 'one-to-one' | 'one-to-many' | 'many-to-one';

  ai?: boolean;
}

export interface TableSysColumnOptions extends TableColumnOptions {
  alias?: string;
  isDisplay?: boolean;
  joinType?: 'one-to-one' | 'one-to-many' | 'many-to-one';
  joinTable?: string;
  ai?: boolean;
}

export class TableSysColumn extends TableColumn {
  alias?: string;
  isDisplay?: boolean = false;
  joinTable?: string;
  joinType?: 'one-to-one' | 'one-to-many' | 'many-to-one';
  constructor(options?: TableSysColumnOptions) {
    super(options);
    if (options) {
      this.alias = options.alias || options.name;
      this.joinTable = options.joinTable || options.joinTable;
      this.joinType = options.joinType || options.joinType;
      this.isDisplay = Boolean(options.isDisplay);
      if (options.ai) {
        this.isGenerated = true;
        this.generationStrategy =
          this.type === 'int'
            ? 'increment'
            : this.type === 'uniqueidentifier'
            ? 'uuid'
            : null;
      }
    }
  }
}

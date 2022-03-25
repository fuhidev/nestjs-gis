import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  TableColumn,
} from 'typeorm';
import { LayerEntity } from '../layer/layer.entity';
import { CodedDomainEntity } from '../coded-domain/coded-domain.entity';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

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
  @Column()
  joinTable: string;
  @Column()
  joinType: string;
}

export interface TableSysColumnOptions extends TableColumnOptions {
  alias?: string;
  isDisplay?: boolean;
}

export class TableSysColumn extends TableColumn {
  alias?: string;
  isDisplay?: boolean = false;
  constructor(options?: TableSysColumnOptions) {
    super(options);
    if (options) {
      this.alias = options.alias || options.name;
      this.isDisplay = Boolean(options.isDisplay);
    }
  }
}

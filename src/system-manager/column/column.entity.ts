import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  TableColumn,
  BeforeUpdate,
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

  ai?:boolean;

  @BeforeInsert()
  @BeforeUpdate()
  updateJoinTable() {
    // nếu join table không được set giá trị thì joinType cũng không được set giá trị
    // mặc joinType là many-to-one
    if (this.joinTable) {
      if (!this.joinType) {
        this.joinType = 'many-to-one';
      }
    } else {
      this.joinType = null;
    }
  }
}

export interface TableSysColumnOptions extends TableColumnOptions {
  alias?: string;
  isDisplay?: boolean;
  joinType?: string;
  joinTable?: string;
  ai?: boolean;
}

export class TableSysColumn extends TableColumn {
  alias?: string;
  isDisplay?: boolean = false;
  joinTable?: string;
  joinType?: string;
  constructor(options?: TableSysColumnOptions) {
    super(options);
    if (options) {
      this.alias = options.alias || options.name;
      this.joinTable = options.joinTable || options.joinTable;
      this.joinType = options.joinType || options.joinType;
      this.isDisplay = Boolean(options.isDisplay);
      if (options.ai) {
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

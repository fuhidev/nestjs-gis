import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { LayerEntity } from '../layer/layer.entity';
import { CodedDomainEntity } from '../coded-domain/coded-domain.entity';

export class ColumnEntity {
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
}

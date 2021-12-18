import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DomainGroupEntity } from '../domain-group/domain-group.entity';

@Entity('SYS_Domain')
export class DomainEntity {
  @PrimaryColumn({ name: 'DomainId' }) domainId: string;
  @Column({ name: 'Url' }) url: string;
  @Column({ name: 'DomainName' }) domainName: string;
  @Column({ name: 'STT', type: 'int', default: 0 }) stt: number;
  @Column({
    name: 'DomainGroup',
    nullable: true,
  })
  domainGroupId: string;
  @JoinColumn({ name: 'DomainGroup' })
  @ManyToOne(() => DomainGroupEntity, {
    onDelete: 'CASCADE',
  })
  domainGroup: DomainGroupEntity;
}

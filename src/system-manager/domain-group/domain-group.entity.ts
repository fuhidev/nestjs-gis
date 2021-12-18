import { Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('SYS_DomainGroup')
export class DomainGroupEntity {
  @PrimaryColumn({ name: 'DomainGroupId' }) domainGroupId: string;
  @Column({ name: 'DomainGroupName' }) domainGroupName: string;
  @Column({ name: 'STT', type: 'int', default: 0 }) stt: number;
}

import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TIMDUONG', { synchronize: false })
export class TimDuongEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'TenDuong',
    nullable: true,
    alias: 'Tên đường',
  })
  tenDuong: string;
}

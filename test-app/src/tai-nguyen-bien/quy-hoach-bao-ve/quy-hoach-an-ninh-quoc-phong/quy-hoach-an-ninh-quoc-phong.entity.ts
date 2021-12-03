import { Column } from 'nestjs-gis';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QUYHOACH_ANNINHQUOCPHONG', { synchronize: false })
export class QuyHoachAnNinhQuocPhongEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'Ten',
    nullable: true,
    alias: 'Tên',
    isDisplayColumn: true,
  })
  ten: string;
}

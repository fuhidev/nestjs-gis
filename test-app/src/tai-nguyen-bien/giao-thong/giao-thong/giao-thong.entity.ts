import { Column } from 'nestjs-gis';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiMatGiaoThongEntity } from './danh-muc/dm-loai-mat-giao-thong/dm-loai-mat-giao-thong.entity';

@Entity('GIAOTHONG', { synchronize: false })
export class GiaoThongEntity {
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
  })
  ten: string;

  @Column({
    name: 'LoaiMatGiaoThong',
    nullable: true,
    alias: 'aliasName',
  })
  maLoaiMatGiaoThong: string;
  @JoinColumn({ name: 'LoaiMatGiaoThong' })
  @ManyToOne(() => DMLoaiMatGiaoThongEntity, {
    onDelete: 'CASCADE',
  })
  LoaiMatGiaoThong: DMLoaiMatGiaoThongEntity;
}

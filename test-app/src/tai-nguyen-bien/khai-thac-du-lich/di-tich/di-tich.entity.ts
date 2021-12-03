import {
  Column,
  geometryTransformer,
  GeometryTypeEnum,
  Point,
} from 'nestjs-gis';
import { type } from 'os';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMCapDiTichEntity } from './danh-muc/dm-cap-di-tich/dm-cap-di-tich.entity';

@Entity('DITICH', { synchronize: false })
export class DiTichEntity {
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

  @Column({
    name: 'Loai',
    nullable: true,
    alias: 'Loại',
  })
  loai: string;

  @Column({
    name: 'DiaChi',
    nullable: true,
    alias: 'Địa chỉ',
  })
  diaChi: string;

  @Column({
    name: 'LoaiHinh',
    nullable: true,
    alias: 'Loại hình',
  })
  loaiHinh: string;

  @Column({
    name: 'Cap',
    nullable: true,
    alias: 'Cấp',
  })
  maCap: string;
  @JoinColumn({ name: 'Cap' })
  @ManyToOne(() => DMCapDiTichEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cap: DMCapDiTichEntity;

  @Column({
    name: 'SoQuyetDinh',
    nullable: true,
    alias: 'Số quyết định',
  })
  soQuyetDinh: string;

  @Column({
    name: 'NgayCap',
    nullable: true,
    alias: 'Ngày cấp',
  })
  ngayCap: Date;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Point,
  })
  shape: Point;
}

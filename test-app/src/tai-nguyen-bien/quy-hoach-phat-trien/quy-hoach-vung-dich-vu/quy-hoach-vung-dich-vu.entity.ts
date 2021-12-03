import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMLoaiKhuVucDichVuEntity } from './danh-muc/dm-loai-khu-vuc-dich-vu/dm-loai-khu-vuc-dich-vu.entity';

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

  @Column({
    name: 'LoaiKhuVucDichVu',
    nullable: true,
    alias: 'Loại khu vực dich vụ',
  })
  maLoaiKhu: string;
  @JoinColumn({ name: 'LoaiKhuVucDichVu' })
  @ManyToOne(() => DMLoaiKhuVucDichVuEntity, {
    onDelete: 'CASCADE',
  })
  loaiKhu: DMLoaiKhuVucDichVuEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}

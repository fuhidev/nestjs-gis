import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DmLoaiKhuBaoVeEntity } from './danh-muc/dm-loai-khu-bao-ve/dm-loai-khu-bao-ve.entity';

@Entity('QUYHOACH_VUNGBAOVE', { synchronize: false })
export class QuyHoachVungBaoVeEntity {
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
    name: 'LoaiKhu',
    nullable: true,
    alias: 'Loại khu',
  })
  maLoaiKhu: string;
  @JoinColumn({ name: 'LoaiKhu' })
  @ManyToOne(() => DmLoaiKhuBaoVeEntity, {
    onDelete: 'CASCADE',
  })
  loaiKhu: DmLoaiKhuBaoVeEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}

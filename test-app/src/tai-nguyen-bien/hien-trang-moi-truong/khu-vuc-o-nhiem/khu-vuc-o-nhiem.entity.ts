import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMKhuVucONhiemEntity } from './danh-muc/dm-khu-vuc-o-nhiem/dm-khu-vuc-o-nhiem.entity';

@Entity('KHUVUCONHIEM', { synchronize: false })
export class KhuVucONhiemEntity {
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
    name: 'LoaiKhuVucONhiem',
    nullable: true,
    alias: 'Loại khu vực ô nhiễm',
  })
  maLoaiKhuVucONhiem: number;
  @JoinColumn({ name: 'LoaiKhuVucONhiem' })
  @ManyToOne(() => DMKhuVucONhiemEntity, {
    onDelete: 'CASCADE',
  })
  loaiKhuVucONhiem: DMKhuVucONhiemEntity;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}

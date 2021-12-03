import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polyline } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DUONGBO', { synchronize: false })
export class DuongBoEntity {
  @PrimaryColumn({ type: 'int', name: 'OBJECTID' }) objectId: number;

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
    name: 'CauTruc',
    nullable: true,
    alias: 'Cấu trúc',
  })
  cauTruc: string;

  @Column({
    name: 'LoaiHinh',
    nullable: true,
    alias: 'Loại hình',
  })
  loaiHinh: string;

  @Column({
    name: 'ChieuDai',
    nullable: true,
    alias: 'Chiều dài',
    type: 'float',
  })
  chieuDai: number;

  @Column({
    name: 'DoSau',
    nullable: true,
    alias: 'Độ sâu',
    type: 'float',
  })
  doSau: number;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polyline,
  })
  shape: Polyline;
}

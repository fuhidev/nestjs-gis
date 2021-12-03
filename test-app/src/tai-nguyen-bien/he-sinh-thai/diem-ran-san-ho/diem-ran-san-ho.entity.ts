import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('DIEMRANSANHO', { synchronize: false })
export class DiemRanSanHoEntity {
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
    name: 'DoPhuHopPhanDaySHCung',
    nullable: true,
  })
  doPhuHopPhanDaySHCung: string;

  @Column({
    name: 'DoPhuHopPhanDaySHMem',
    nullable: true,
  })
  doPhuHopPhanDaySHMem: string;

  @Column({
    name: 'CacGiongUuThe',
    nullable: true,
    alias: 'Các giống ưu thế',
  })
  cacGiongUuThe: string;

  @Column({
    name: 'Loai',
    nullable: true,
    alias: 'Loại',
  })
  loai: string;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}

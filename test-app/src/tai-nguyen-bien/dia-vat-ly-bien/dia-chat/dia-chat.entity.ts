import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DIACHATBIEN', { synchronize: false })
export class DiaChatEntity {
  @PrimaryColumn({ name: 'OBJECTID', type: 'int' }) objectId: number;

  @Column({
    name: 'Ma',
    nullable: true,
    alias: 'Mã',
  })
  ma: string;

  @Column({
    name: 'DoSau',
    nullable: true,
    alias: 'Độ sâu',
    type: 'float',
  })
  doSau: number;

  @Column({
    name: 'TuoiDiaChat',
    nullable: true,
    alias: 'Tuổi địa chất',
  })
  tuoiDiaChat: string;

  @Column({
    name: 'MoTa',
    nullable: true,
    alias: 'Mô tả',
  })
  moTa: string;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}

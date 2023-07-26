import {
  Column,
  geometryTransformer,
  GeometryTypeEnum,
  Point,
} from 'nestjs-gis';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('QHCT_CAYXANH')
export class CayXanhEntity {
  @PrimaryColumn({ name: 'OBJECTID' }) objectId: number;

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Point,
  })
  shape: Point;
}

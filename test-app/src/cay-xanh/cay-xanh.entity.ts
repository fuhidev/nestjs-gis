import { Column, geometryTransformer, GeometryTypeEnum, Point } from 'nestjs-gis';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CayXanh')
export class CayXanhEntity {
    @PrimaryGeneratedColumn() id:string;
    @Column({
        name: 'SHAPE',
        transformer: geometryTransformer,
        type: 'geometry',
        spatialFeatureType: GeometryTypeEnum.Point
    })
    shape: Point;
}

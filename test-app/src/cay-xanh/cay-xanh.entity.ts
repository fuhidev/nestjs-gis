import { Column, geometryTransformer, GeometryTypeEnum, Point } from 'nestjs-gis';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('HTKT_CX_CayXanh')
export class CayXanhEntity {
    @PrimaryGeneratedColumn() id:string;

    @Column({
        name: 'NguoiCapNhat',
        nullable: true,
        alias: 'aliasName'
    })
    nguoiCapNhat: string;
    @Column({
        name: 'SHAPE',
        transformer: geometryTransformer,
        type: 'geometry',
        spatialFeatureType: GeometryTypeEnum.Point
    })
    shape: Point;
}

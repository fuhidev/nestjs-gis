import { Column, geometryTransformer, GeometryTypeEnum } from 'nestjs-gis';
import { Polygon } from 'terraformer-arcgis-parser';
import { Entity, JoinTable, OneToMany, PrimaryColumn } from 'typeorm';
import { NhanChimBienVatChatEntity } from './nhan-chim-bien-vat-chat/nhan-chim-bien-vat-chat.entity';

@Entity('NHANCHIMBIEN', { synchronize: false })
export class NhanChimBienEntity {
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

  @JoinTable()
  @OneToMany(() => NhanChimBienVatChatEntity, (e) => e.nhanChimBien, {})
  vatChatDuocNhanChims: NhanChimBienVatChatEntity[];

  @Column({
    name: 'SHAPE',
    transformer: geometryTransformer,
    type: 'geometry',
    spatialFeatureType: GeometryTypeEnum.Polygon,
  })
  shape: Polygon;
}

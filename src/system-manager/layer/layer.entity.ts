import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeUpdate } from "typeorm";
import { DatasetEntity } from "../dataset/dataset.entity";
import { ColumnEntity } from "../column/column.entity";
import { RoleLayerEntity } from "../role-layer/role-layer.entity";

@Entity({
    name: 'SYS_Layer',
})
export class LayerEntity {
    @PrimaryColumn({ name: 'LayerId', type: 'varchar', length: 255 })
    layerId: string;

    @Column({ name: 'LayerName', type: 'nvarchar', length: 255 })
    layerName: string;

    @Column({ name: 'DatasetId', type: 'varchar', nullable: true })
    datasetId?: string;

    @JoinColumn({ name: 'DatasetId' })
    @ManyToOne(() => DatasetEntity, { cascade: ['remove'], onDelete: 'CASCADE' })
    dataset?: DatasetEntity;
    fields: ColumnEntity[];
    @Column({ name: 'GeometryType', type: 'varchar', length: 50, nullable: true })
    geometryType: string;
    hasVersion: boolean;
    wkt: string;

    @Column({ name: 'Url', type: 'nvarchar', length: 500, nullable: true })
    url: string;

    @OneToMany(() => RoleLayerEntity, e => e.layer)
    roles: RoleLayerEntity[];

    @Column({name:'Config',type:'nvarchar',length:4000,nullable:true})
    config:string;
    // labelingInfo?: LabelClassProperties[];
    // labelsVisible?: boolean;
    // legendEnabled?: boolean;
    // objectIdField?: string;
    // outFields?: string[];
    // popupEnabled?: boolean;
    // popupTemplate?: PopupTemplateProperties;
    // renderer?: RendererProperties;
    // returnM?: boolean;
    // returnZ?: boolean;
    // screenSizePerspectiveEnabled?: boolean;
    // source?: CollectionProperties<GraphicProperties>;
    // sourceJSON?: any;
    // spatialReference?: SpatialReferenceProperties;
    // templates?: FeatureTemplateProperties[];
    // typeIdField?: string;
    // types?: FeatureTypeProperties[];
    // url?: string;

    @BeforeUpdate()
    stringifyConfig() {
        if (this.config && typeof this.config === 'object') {
            this.config = JSON.stringify(this.config);
        }
    }
}
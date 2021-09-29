import { Entity, Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "../role/role.entity";
import { LayerEntity } from "../layer/layer.entity";

@Entity({
  name: 'SYS_Role_Layer'
})
export class RoleLayerEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'RoleId', nullable: false, type: 'uuid' })
  roleId: string;

  @JoinColumn({ name: 'RoleId' })
  @ManyToOne(() => RoleEntity, e => e.roleId, { cascade:['remove'], onDelete: 'CASCADE' })
  role: RoleEntity;

  @Column({ name: 'LayerId', nullable: false, type: 'string' })
  layerId: string;

  @JoinColumn({ name: 'LayerId' })
  @ManyToOne(() => LayerEntity, e => e.layerId, { cascade:['remove'], onDelete: 'CASCADE' })
  layer: LayerEntity;

  @Column({ name: 'IsEdit', nullable: false, default: false })
  isEdit: boolean;
  @Column({ name: 'IsView', nullable: false, default: false })
  isView: boolean;
  @Column({ name: 'IsCreate', nullable: false, default: false })
  isCreate: boolean;
  @Column({ name: 'IsDelete', nullable: false, default: false })
  isDelete: boolean;
  @Column({ name: 'Definition', nullable: true, default: '1=1' })
  definition: string;
}
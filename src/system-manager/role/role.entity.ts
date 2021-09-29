import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { RoleStatusEnum } from "./role.interface";
import { ApplicationEntity } from "../application/application.entity";
import { RoleLayerEntity } from "../role-layer/role-layer.entity";

@Entity({
    name: 'SYS_Role',
})
export class RoleEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'RoleId' })
    roleId: string;

    @Column({ name: 'RoleName', type: 'nvarchar' })
    roleName: string;

    @Column({ name: 'RoleParentId', nullable: true, type: 'uuid' })
    roleParentId: string;


    @JoinColumn({ name: 'RoleParentId' })
    @ManyToOne(() => RoleEntity)
    roleParent: RoleEntity;

    @OneToMany(() => UserEntity, u => u.role)
    users: UserEntity[];

    @Column({ name: 'Status', default: RoleStatusEnum.Open })
    status: string;

    @JoinTable({
        name: 'SYS_Role_Application',
        joinColumn: { name: 'RoleId', referencedColumnName: 'roleId' },
        inverseJoinColumn: { name: 'ApplicationId', referencedColumnName: 'applicationId' },
    })
    @ManyToMany(() => ApplicationEntity)
    applications: ApplicationEntity[];

    @OneToMany(() => RoleLayerEntity, e => e.role)
    layers: RoleLayerEntity[];
}
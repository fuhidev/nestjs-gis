import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ApplicationEntity } from "../application/application.entity";

@Entity({
    name: 'SYS_ApplicationGroup',
})
export class ApplicationGroupEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'ApplicationGroupId' })
    applicationGroupId: string;

    @Column({ name: 'ApplicationGroupName', type: 'nvarchar' })
    applicationGroupName: string;

    @Column({ name: 'ParentId', type: 'uuid', nullable: true })
    parentId: string;

    @JoinColumn({ name: 'ParentId' })
    @ManyToOne(() => ApplicationGroupEntity, c => c.applicationGroupId)
    parent: ApplicationGroupEntity;

    @OneToMany(() => ApplicationGroupEntity, c => c.parent)
    childs: ApplicationGroupEntity[];

    @OneToMany(() => ApplicationEntity, c => c.applicationGroup)
    applications: ApplicationEntity[];
}

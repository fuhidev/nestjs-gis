import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { ApplicationEntity } from "../application/application.entity";
import { LayerEntity } from "../layer/layer.entity";
import { LoggerActionTypeEntity } from "./logger-action-type.entity";
import { LoggerActionTypeEnum } from "./logger.interface";

@Entity({
    name: 'SYS_Logger',
})
export class LoggerEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;

    @Column({ name: 'UserId', nullable: false, type: 'uuid' })
    userId: string;

    @JoinColumn({ name: 'UserId' })
    @ManyToOne(() => UserEntity, e => e.userId, { cascade: true, onDelete: 'CASCADE' })
    user: UserEntity;

    @CreateDateColumn({ name: 'CreateDate' })
    createDate: Date;

    @Column({ name: 'ApplicationId', nullable: true, type: 'uuid' })
    applicationId: string;

    @JoinColumn({ name: 'ApplicationId' })
    @ManyToOne(() => ApplicationEntity, e => e.applicationId)
    application: ApplicationEntity;

    @Column({ name: 'ActionTypeId', type: 'varchar', nullable: false })
    actionTypeId: LoggerActionTypeEnum;

    @JoinColumn({ name: 'ActionTypeId' })
    @ManyToOne(() => LoggerActionTypeEntity, e => e.id, { cascade: ['insert'] })
    actionType: LoggerActionTypeEntity;

    @Column({ name: 'Description', type: 'nvarchar', length: 'MAX', nullable: true })
    description: string;

    @Column({ name: 'Note', type: 'nvarchar', length: 'MAX', nullable: true })
    note: string;

    @Column({ name: 'TableName', type: 'varchar', nullable: true })
    tableName: string;

    @JoinColumn({ name: 'TableName' })
    @ManyToOne(() => LayerEntity, e => e.layerId)
    table: LayerEntity;

    @Column({ name: 'ObjectId', type: 'int', nullable: true })
    objectId: number;

}
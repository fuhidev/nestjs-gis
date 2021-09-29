import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: 'SYS_LoggerActionType' })
export class LoggerActionTypeEntity {
    @PrimaryColumn({ name: 'ID', type: 'varchar' })
    id: string;
    @Column({ name: 'Name', type: 'nvarchar' })
    name: string;
}
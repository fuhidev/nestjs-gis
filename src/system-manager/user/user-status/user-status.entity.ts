import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({name:'SYS_UserStatus'})
export class UserStatusEntity{
    @PrimaryColumn({name:'UserStatusId',type:'varchar'})
    id:string;

    @Column({name:'UserStatusName',type:'nvarchar'})
    name:string;
}
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, BeforeInsert, EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { CodedDomainEntity } from "../coded-domain.entity";

export class CodedValueEntity {
    id: string;
    code: string;
    name: string;
    codedDomainId: string;
    domain: CodedDomainEntity;
}
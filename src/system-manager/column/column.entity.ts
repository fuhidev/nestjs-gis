import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinColumn, ManyToOne } from "typeorm";
import { LayerEntity } from "../layer/layer.entity";
import { CodedDomainEntity } from "../coded-domain/coded-domain.entity";

export class ColumnEntity {
    id: string;
    name: string;
    alias: string;
    type: string;
    isNullable: boolean;
    domainId: string;
    domain: CodedDomainEntity;
    layerId: string;
    layer: LayerEntity;
}
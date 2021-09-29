import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { CodedValueEntity } from "./coded-value/coded-value.entity";

export class CodedDomainEntity {
    id: string;
    name: string;
    type: 'esriFieldTypeInteger' | 'esriFieldTypeSmallInteger' | 'esriFieldTypeString';
    codedValues: CodedValueEntity[];
}
import { Injectable } from '@nestjs/common';
import { CodedDomainEntity } from './coded-domain.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CodedValueEntity } from './coded-value/coded-value.entity';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class CodedDomainService {
    constructor(
        @InjectEntityManager() private entityManager: EntityManager
    ) {
    }

    getBuilder() {
        const builder = this.entityManager.createQueryBuilder();
        builder.from('GDB_ITEMS', 'items')
            .innerJoinAndSelect('GDB_ITEMTYPES', 'itemtypes', 'items.Type = itemtypes.UUID')
            .select(`items.Name`, 'id')
            .addSelect(`items.Definition.value('(/GPCodedValueDomain2/Description)[1]','nvarchar(max)')`, 'name')
            .addSelect(`items.Definition.value('(/GPCodedValueDomain2/FieldType)[1]','nvarchar(max)')`, 'type')
            .where(`itemtypes.Name = 'Coded Value Domain'`)
            .orderBy('items.Name');
        return builder;
    }

    async getMany(req?: CrudRequest): Promise<CodedDomainEntity[]> {
        const builder = this.getBuilder();
        const result: CodedDomainEntity[] = await builder.execute();

        return result;
    }

    async getOne(id: string): Promise<CodedDomainEntity> {
        const builder = this.getBuilder();
        builder.andWhere(`items.Name=:name`, { name: id });
        const result = await builder.execute();
        return result[0];
    }

    getManyCodedValues(domainId: string): Promise<CodedValueEntity[]> {
        const sql = `SELECT
        id='${domainId}.'+codedValue.value('Code[1]', 'nvarchar(max)')
        ,code = codedValue.value('Code[1]', 'nvarchar(max)')
        ,name = codedValue.value('Name[1]', 'nvarchar(max)')
        FROM GDB_ITEMS AS items INNER JOIN GDB_ITEMTYPES AS itemtypes
        ON items.Type = itemtypes.UUID
        CROSS APPLY items.Definition.nodes
        ('/GPCodedValueDomain2/CodedValues/CodedValue') AS CodedValues(codedValue)
        WHERE
        items.Name = @0`;
        return this.entityManager.query(sql, [domainId]);
    }

    async  updateOne(domainId: string, domain: CodedDomainEntity) {
        if (!domainId) { throw new Error('Không xác định được domainId') };
        if (domain.name) {
            const node = `/GPCodedValueDomain2/Description`;
            const exist = await
                this.entityManager.query(`select value = gi.Definition.exist('${node}/text()') from GDB_ITEMS gi where gi.Name =@0`, [domainId]);

            const isExist = Boolean(exist[0] && exist[0].value);

            const sqlModify =
                isExist ? `'  
            replace value of(/${node}/text())[1]  
            with "${domain.name}"'` :
                    `'insert text{"${domain.name}"} into (/${node})[1]'`

            const sql = `
            UPDATE
            GDB_ITEMS
          SET
            Definition.modify(N${sqlModify})
          where
            Name = @0 
            `;
            await this.entityManager.query(sql, [domainId]);
            return true;
        }
        return false;
    }

    async deleteCodeValue(domainId: string, code: string | number) {
        if (!domainId) { throw new Error('Không xác định được domain') }
        if (code === undefined || code === null) { throw new Error('Không xác định được code') }
        const sql = `UPDATE
            GDB_ITEMS
            SET
            Definition.modify(N'delete /GPCodedValueDomain2/CodedValues/CodedValue[Code/text() = "${code}"]')
            where
            Name = @0`;
            
        return await this.entityManager.query(sql, [domainId]);
    }

    async insertCodeValue(domainId: string, dto: CodedValueEntity) {
        const domain = await this.getOne(domainId);
        if (!domain) {
            throw new Error('Không xác được được domain');
        }

        const type = domain.type === 'esriFieldTypeSmallInteger' ? 'short'
            : domain.type === 'esriFieldTypeString' ? 'string'
                : domain.type === 'esriFieldTypeInteger' ? 'int' : null
            ;
        if (!type) {
            throw new Error('Không xác định được type của domain');
        }
        // kiểm tra nếu có rồi thì không insert
        const codedValues = await this.getManyCodedValues(domainId);
        if (codedValues.find(f => f.code === dto.code)) {
            throw new Error('Đã tồn tại code');
        }
        const sql = `
        UPDATE
            GDB_ITEMS
        SET
        Definition.modify(N'insert
        <CodedValue xsi:type="typens:CodedValue">
            <Name>${dto.name}</Name>
            <Code xsi:type="xs:${type}">${dto.code}</Code>
            </CodedValue>
        as last into (/GPCodedValueDomain2/CodedValues)[1]
        ')
        where
            Name = @0
        `;
        return await this.entityManager.query(sql, [domainId])
    }
}

import { Controller, Post, Get, Param, Patch, Body, UsePipes, ValidationPipe, BadRequestException, Delete } from '@nestjs/common';
import { CodedDomainService } from './coded-domain.service';
import { CodedDomainEntity } from './coded-domain.entity';
import { CodedValueEntity } from './coded-value/coded-value.entity';

@Controller('sys/coded-domain')
export class CodedDomainController {
    constructor(private readonly service: CodedDomainService) {

    }

    @Get()
    getMany() {
        return this.service.getMany();
    }

    @Delete(':domainId/coded-values/:code')
    deleteCodedValue(@Param('domainId') domainId: string,
        @Param('code') code: string | number
    ) {
        if (!domainId) throw new BadRequestException('Không xác định được domainId');
        if (code === undefined || code === null) throw new BadRequestException('Không xác định được code');
        try {
            return this.service.deleteCodeValue(domainId, code);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

    }
    @Get(':domainId/coded-values')
    getManyCodedValues(@Param('domainId') domainId: string) {
        return this.service.getManyCodedValues(domainId);
    }
    @Post(':domainId/coded-values')
    @UsePipes(new ValidationPipe())
    insertCodedValue(@Param('domainId') domainId: string, @Body() dto: CodedValueEntity) {
        try {
            if (!domainId) throw new Error('Không xác định được domainId');
            if (!dto || (dto && !dto.code && !dto.name)) throw new Error('Không xác định được dto');
            return this.service.insertCodeValue(domainId, dto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

    }

    @Patch(':domainId')
    patch(@Param('domainId') domainId: string, @Body() dto: CodedDomainEntity) {
        return this.service.updateOne(domainId, dto);
    }


}

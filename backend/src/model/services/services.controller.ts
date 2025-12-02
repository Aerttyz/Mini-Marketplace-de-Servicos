import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { Role, Service } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateServiceDto } from './dto/create-service-input';
import { ProviderServicesService } from './services.service';

@Controller('services')
export class ProviderServicesController {
    constructor(private providerServicesService: ProviderServicesService) { }

    @Post()
    @Auth(Role.PROVIDER)
    async create(
        @Body() data: CreateServiceDto,
        @User() user: UserType,
    ): Promise<Service> {
        return this.providerServicesService.create({ ...data, providerId: user.id });
    }

    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
    ) {
        return this.providerServicesService.findAll(categoryId, search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.providerServicesService.findOne(id);
    }
}

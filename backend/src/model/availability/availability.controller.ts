import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { Role } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability-input';

@Controller('availability')
export class AvailabilityController {
    constructor(private availabilityService: AvailabilityService) { }

    @Post()
    @Auth(Role.PROVIDER)
    async create(
        @Body() data: CreateAvailabilityDto,
        @User() user: UserType,
    ) {
        return this.availabilityService.create(user.id, data);
    }

    @Get()
    @Auth(Role.PROVIDER)
    async findAll(@User() user: UserType) {
        return this.availabilityService.findMyAvailability(user.id);
    }

    @Get(':providerId/slots')
    getSlots(
        @Param('providerId') providerId: string,
        @Query('date') date: string
    ) {
        return this.availabilityService.getAvailableSlots(providerId, date);
    }

}

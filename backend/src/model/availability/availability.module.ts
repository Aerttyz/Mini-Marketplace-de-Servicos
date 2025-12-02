import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  providers: [AvailabilityService, PrismaService],
  controllers: [AvailabilityController]
})
export class AvailabilityModule { }

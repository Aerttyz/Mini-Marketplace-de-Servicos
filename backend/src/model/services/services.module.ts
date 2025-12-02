import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ProviderServicesController } from './services.controller';
import { ProviderServicesService } from './services.service';

@Module({
  controllers: [ProviderServicesController],
  providers: [ProviderServicesService, PrismaService],
})
export class ProviderServicesModule { }

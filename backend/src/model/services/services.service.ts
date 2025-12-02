import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { SearchService } from '../search/search.service';
import { CreateServiceDto } from './dto/create-service-input';

@Injectable()
export class ProviderServicesService {
    constructor(private prisma: PrismaService, private searchService: SearchService) { }

    async create(data: CreateServiceDto): Promise<Service> {
        const provider = await this.prisma.provider.findUnique({
            where: { userId: data.providerId },
        });

        if (!provider) {
            throw new BadRequestException('Prestador de serviços não encontrado');
        }

        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new BadRequestException('Categoria de serviço não encontrada');
        }

        const service = await this.prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                photos: data.photos || [],

                category: { connect: { id: data.categoryId } },
                provider: { connect: { id: provider.id } },

                variations: {
                    create: data.variations.map(variation => ({
                        name: variation.name,
                        price: variation.price,
                        duration_minutes: variation.duration_minutes,
                    })),
                },
            },
            include: {
                variations: true,
                category: true
            },
        });

        await this.searchService.indexService(service);

        return service;
    }

    async findAll(categoryId?: string, search?: string): Promise<Service[]> {
        let whereClause: any = {
            category_id: categoryId ? categoryId : undefined,
        };

        if (search) {
            const serviceIds = await this.searchService.searchServices(search);
            whereClause.id = { in: serviceIds };
        }

        return this.prisma.service.findMany({
            where: whereClause,
            include: {
                category: true,
                provider: {
                    include: { user: { select: { username: true } } }
                },
                variations: {
                    orderBy: { price: 'asc' }
                }
            }
        });
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
                provider: {
                    include: { user: { select: { username: true } } }
                },
                variations: {
                    orderBy: { price: 'asc' }
                }
            }
        });
        if (!service) {
            throw new NotFoundException('Serviço não encontrado');
        }
        return service;
    }
}

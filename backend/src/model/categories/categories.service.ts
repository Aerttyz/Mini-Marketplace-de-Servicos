import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

}

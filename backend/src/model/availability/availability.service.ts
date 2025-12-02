import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Cache } from 'cache-manager';
import { PrismaService } from 'src/common/database/prisma.service';
import { minutesToTime, timeToMinutes } from 'src/common/helpers/time';
import { CreateAvailabilityDto } from './dto/create-availability-input';


@Injectable()
export class AvailabilityService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async create(userId: string, data: CreateAvailabilityDto) {
        const provider = await this.prisma.provider.findUnique({
            where: { userId },
        });

        if (!provider) {
            throw new BadRequestException('Usuário não é um prestador.');
        }

        const dataToInsert: Prisma.AvailabilityCreateManyInput[] = [];

        for (const slot of data.slots) {
            const startMin = timeToMinutes(slot.startTime);
            const endMin = timeToMinutes(slot.endTime);

            if (endMin < startMin) {

                dataToInsert.push({
                    provider_id: provider.id,
                    day_of_week: slot.dayOfWeek,
                    start_time: startMin,
                    end_time: 1439,
                });

                const nextDay = slot.dayOfWeek + 1 > 6 ? 0 : slot.dayOfWeek + 1;

                dataToInsert.push({
                    provider_id: provider.id,
                    day_of_week: nextDay,
                    start_time: 0,
                    end_time: endMin,
                });

            } else {
                dataToInsert.push({
                    provider_id: provider.id,
                    day_of_week: slot.dayOfWeek,
                    start_time: startMin,
                    end_time: endMin,
                });
            }
        }

        await this.prisma.$transaction([
            this.prisma.availability.deleteMany({
                where: { provider_id: provider.id },
            }),
            this.prisma.availability.createMany({
                data: dataToInsert,
            }),
        ]);

        return { message: 'Agenda atualizada com sucesso' };
    }

    async findMyAvailability(userId: string) {
        const provider = await this.prisma.provider.findUnique({ where: { userId } });
        if (!provider) return [];

        return this.prisma.availability.findMany({
            where: { provider_id: provider.id },
            orderBy: { day_of_week: 'asc' }
        });
    }

    async getAvailableSlots(providerId: string, dateString: string) {

        const cacheKey = `slots:${providerId}:${dateString}`;

        const cachedSlots = await this.cacheManager.get<string[]>(cacheKey);
        if (cachedSlots) {
            return cachedSlots;
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) throw new BadRequestException('Data inválida');

        const dayOfWeek = date.getUTCDay();

        const availabilityRules = await this.prisma.availability.findMany({
            where: { provider_id: providerId, day_of_week: dayOfWeek }
        });

        if (availabilityRules.length === 0) return [];

        const startOfDay = new Date(date); startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date); endOfDay.setUTCHours(23, 59, 59, 999);

        const appointments = await this.prisma.appointment.findMany({
            where: {
                provider_id: providerId,
                status: { not: 'CANCELLED' },
                start_date: { gte: startOfDay, lte: endOfDay }
            }
        });

        const slots: string[] = [];
        const step = 30;

        for (const rule of availabilityRules) {
            let currentMin = rule.start_time;

            while (currentMin + step <= rule.end_time) {
                const slotStart = currentMin;
                const slotEnd = currentMin + step;
                const isBusy = appointments.some(app => {
                    const appStartMin = app.start_date.getUTCHours() * 60 + app.start_date.getUTCMinutes();
                    const appEndMin = app.end_date.getUTCHours() * 60 + app.end_date.getUTCMinutes();

                    return (slotStart < appEndMin) && (slotEnd > appStartMin);
                });

                if (!isBusy) {
                    slots.push(minutesToTime(slotStart));
                }

                currentMin += step;
            }
        }
        await this.cacheManager.set(cacheKey, slots, 60000);

        return slots;
    }
}
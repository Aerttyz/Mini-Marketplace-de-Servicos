import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment-input';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(clientId: string, dto: CreateAppointmentDto) {
        const provider = await this.prisma.provider.findUnique({
            where: { id: dto.providerId }
        });
        if (!provider) throw new NotFoundException('Prestador não encontrado');

        const variation = await this.prisma.serviceVariation.findUnique({
            where: { id: dto.variationId }
        });

        if (!variation) throw new NotFoundException('Variação de serviço não encontrada');

        const start = new Date(dto.startDate);
        const durationMs = variation.duration_minutes * 60000;
        const end = new Date(start.getTime() + durationMs);

        const conflito = await this.prisma.appointment.findFirst({
            where: {
                provider_id: dto.providerId,
                status: { not: 'CANCELLED' },
                start_date: { lt: end },
                end_date: { gt: start }
            }
        });

        if (conflito) {
            throw new BadRequestException('Horário indisponível! Alguém acabou de reservar.');
        }

        return this.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointment.create({
                data: {
                    client_id: clientId,
                    provider_id: dto.providerId,
                    variation_id: dto.variationId,
                    start_date: start,
                    end_date: end,
                    status: 'CONFIRMED'
                }
            });

            await tx.notification.create({
                data: {
                    userId: provider.userId,
                    message: `Novo agendamento! Serviço: ${variation.name} em ${start.toLocaleString('pt-BR')}`
                }
            });

            return appointment;
        });
    }

    async findAllByProvider(providerUserId: string) {
        const provider = await this.prisma.provider.findUnique({
            where: { userId: providerUserId }
        });

        if (!provider) return [];

        return this.prisma.appointment.findMany({
            where: {
                provider_id: provider.id
            },
            include: {
                client: { select: { username: true, email: true } },
                variation: true,
            },
            orderBy: { start_date: 'desc' }
        });
    }

    async cancel(appointmentId: string, userId: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { provider: true }
        });

        if (!appointment) throw new NotFoundException('Agendamento não encontrado');

        if (appointment.client_id !== userId && appointment.provider.userId !== userId) {
            throw new BadRequestException('Você não tem permissão para cancelar este agendamento');
        }

        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' }
        });
    }
}

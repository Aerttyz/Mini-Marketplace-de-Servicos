import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class RefreshTokenService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async generate(userId: string) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
                expiresAt: { lt: new Date() },
            },
        });

        const tokens = await this.prisma.refreshToken.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
        if (tokens.length >= 4) {
            await this.prisma.refreshToken.delete({ where: { id: tokens[0].id } });
        }

        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });

        return refreshToken;
    }

    async refresh(oldToken: string) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: oldToken },
            include: { user: true },
        });

        if (!stored) throw new Error('Invalid refresh token');

        if (stored.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: stored.id } });
            throw new Error('Refresh token expired');
        }

        const payload = {
            sub: stored.user.id,
            email: stored.user.email,
            username: stored.user.username,
            role: stored.user.role,
        }

        const accessToken = this.jwtService.sign(payload);

        return accessToken;
    }
}

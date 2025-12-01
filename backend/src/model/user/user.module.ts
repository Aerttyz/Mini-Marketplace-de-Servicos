import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    imports: [AuthModule],
    providers: [UserService, PrismaService],
    controllers: [UserController],
})
export class UserModule { }

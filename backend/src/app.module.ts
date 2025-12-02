import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/database/prisma.service';
import { AppointmentsModule } from './model/appointments/appointments.module';
import { AuthModule } from './model/auth/auth.module';
import { AvailabilityModule } from './model/availability/availability.module';
import { CategoriesModule } from './model/categories/categories.module';
import { SearchModule } from './model/search/search.module';
import { ProviderServicesModule } from './model/services/services.module';
import { UserModule } from './model/user/user.module';
import { NotificationsService } from './model/notifications/notifications.service';
import { NotificationsModule } from './model/notifications/notifications.module';

@Module({
  imports: [AuthModule, UserModule, ProviderServicesModule, AvailabilityModule, CategoriesModule, AppointmentsModule, SearchModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: 6379,
          },
          ttl: 600000,
        }),
      }),
    }),
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, NotificationsService],
})
export class AppModule { }

import { Controller, Get, Param, Patch } from '@nestjs/common';
import { Role, User as UserType } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @Auth(Role.CLIENT, Role.PROVIDER)
    async findAll(@User() user: UserType) {
        return this.notificationsService.findAll(user.id);
    }

    @Patch(':id/read')
    @Auth(Role.CLIENT, Role.PROVIDER)
    async markAsRead(@Param('id') id: string, @User() user: UserType) {
        return this.notificationsService.markAsRead(id, user.id);
    }
}
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { User as UserType } from '@prisma/client';
import { Role } from '@prisma/client';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment-input';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @Auth(Role.CLIENT)
  async create(
    @Body() data: CreateAppointmentDto,
    @User() user: UserType,
  ) {
    return this.appointmentsService.create(user.id, data);
  }

  @Get('my-schedule')
  @Auth(Role.PROVIDER)
  async getmMySchedule(@User() user: UserType) {
    return this.appointmentsService.findAllByProvider(user.id);
  }

  @Patch(':id/cancel')
  @Auth(Role.CLIENT, Role.PROVIDER)
  async cancel(@Param('id') id: string, @User() user: UserType) {
    return this.appointmentsService.cancel(id, user.id);
  }
}

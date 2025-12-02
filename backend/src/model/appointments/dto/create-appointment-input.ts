import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    variationId: string;

    @IsUUID()
    providerId: string;

    @IsDateString()
    startDate: string;

}